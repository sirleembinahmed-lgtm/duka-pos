const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'duka.db');

fs.mkdirSync(dataDir, { recursive: true });

const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      barcode TEXT UNIQUE,
      category TEXT,
      price REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT,
      payment_method TEXT,
      items_count INTEGER NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY(sale_id) REFERENCES sales(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `);

  const productCount = await get('SELECT COUNT(*) as total FROM products');
  if (!productCount || productCount.total === 0) {
    const sampleProducts = [
      ['Maize Flour 2kg', '1001', 'Staples', 330, 25],
      ['Cooking Oil 1L', '1002', 'Groceries', 220, 18],
      ['Rice 5kg', '1003', 'Staples', 640, 14],
      ['Soap Bar', '1004', 'Household', 90, 40],
      ['Soda 300ml', '1005', 'Beverages', 60, 32],
      ['Biscuits', '1006', 'Snacks', 45, 60],
      ['Milk 1L', '1007', 'Dairy', 130, 22],
      ['Sugar 1kg', '1008', 'Staples', 180, 30]
    ];

    for (const [name, barcode, category, price, stock] of sampleProducts) {
      await run(
        `INSERT OR IGNORE INTO products (name, barcode, category, price, stock) VALUES (?, ?, ?, ?, ?)`,
        [name, barcode, category, price, stock]
      );
    }
  }
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/products', async (req, res) => {
  try {
    const products = await all('SELECT * FROM products ORDER BY category, name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load products' });
  }
});

app.get('/api/dashboard', async (req, res) => {
  try {
    const salesToday = await get(`
      SELECT COUNT(*) as sales_count, COALESCE(SUM(total), 0) as total_sales
      FROM sales
      WHERE date(created_at) = date('now')
    `);

    const productStock = await get(`
      SELECT COALESCE(SUM(stock), 0) as total_units
      FROM products
    `);

    const itemsSold = await get(`
      SELECT COALESCE(SUM(quantity), 0) as items_sold
      FROM sale_items
      WHERE sale_id IN (
        SELECT id FROM sales WHERE date(created_at) = date('now')
      )
    `);

    const recentSales = await all(`
      SELECT *
      FROM sales
      ORDER BY created_at DESC
      LIMIT 6
    `);

    res.json({
      salesToday: salesToday || { sales_count: 0, total_sales: 0 },
      productStock: productStock || { total_units: 0 },
      itemsSold: itemsSold || { items_sold: 0 },
      recentSales
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to load dashboard' });
  }
});

app.get('/api/sales', async (req, res) => {
  try {
    const sales = await all(`
      SELECT s.*, COUNT(si.id) as item_count
      FROM sales s
      LEFT JOIN sale_items si ON si.sale_id = s.id
      GROUP BY s.id
      ORDER BY s.created_at DESC
      LIMIT 10
    `);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load sales' });
  }
});

app.post('/api/sales', async (req, res) => {
  try {
    const { items = [], paymentMethod = 'Cash', customerName = '' } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const saleItems = [];
    let total = 0;

    for (const item of items) {
      const product = await get('SELECT * FROM products WHERE id = ?', [item.productId]);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const quantity = Number(item.quantity || 0);
      if (quantity <= 0) {
        throw new Error(`Invalid quantity for ${product.name}`);
      }

      if (product.stock < quantity) {
        throw new Error(`Not enough stock for ${product.name}. Available: ${product.stock}`);
      }

      const subtotal = product.price * quantity;
      total += subtotal;
      saleItems.push({ product, quantity, subtotal });
    }

    await run('BEGIN IMMEDIATE');

    try {
      const sale = await run(
        'INSERT INTO sales (customer_name, payment_method, items_count, total) VALUES (?, ?, ?, ?)',
        [customerName, paymentMethod, saleItems.reduce((sum, item) => sum + item.quantity, 0), total]
      );

      for (const item of saleItems) {
        await run(
          'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
          [sale.lastID, item.product.id, item.quantity, item.product.price, item.subtotal]
        );

        await run(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product.id]
        );
      }

      await run('COMMIT');

      res.status(201).json({
        message: 'Sale completed successfully',
        saleId: sale.lastID,
        total,
        customerName,
        items: saleItems.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          subtotal: item.subtotal
        }))
      });
    } catch (error) {
      await run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to complete sale.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Duka POS app is running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});
