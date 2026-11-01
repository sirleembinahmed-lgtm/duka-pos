const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const salesList = document.getElementById('salesList');
const searchInput = document.getElementById('searchInput');
const customerNameInput = document.getElementById('customerName');
const paymentMethodSelect = document.getElementById('paymentMethod');
const checkoutBtn = document.getElementById('checkoutBtn');

const state = {
  products: [],
  cart: []
};

function formatCurrency(value) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2
  }).format(Number(value || 0));
}

async function fetchProducts() {
  const response = await fetch('/api/products');
  const products = await response.json();
  state.products = products;
  renderProducts();
}

async function fetchDashboard() {
  const response = await fetch('/api/dashboard');
  const data = await response.json();

  document.getElementById('todaySales').textContent = formatCurrency(data.salesToday?.total_sales || 0);
  document.getElementById('itemsSold').textContent = data.itemsSold?.items_sold || 0;
  document.getElementById('stockUnits').textContent = data.productStock?.total_units || 0;
  document.getElementById('salesCount').textContent = data.salesToday?.sales_count || 0;

  renderRecentSales(data.recentSales || []);
}

function renderProducts() {
  const searchTerm = (searchInput.value || '').toLowerCase();

  const filteredProducts = state.products.filter((product) => {
    const nameMatches = product.name.toLowerCase().includes(searchTerm);
    const codeMatches = String(product.barcode || '').toLowerCase().includes(searchTerm);
    return nameMatches || codeMatches;
  });

  if (!filteredProducts.length) {
    productGrid.innerHTML = '<div class="empty-cart">No products found.</div>';
    return;
  }

  productGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <div class="product-card">
          <div>
            <h3>${product.name}</h3>
            <div class="product-meta">
              <span>${product.category || 'General'}</span>
              <span>Stock: ${product.stock}</span>
            </div>
          </div>
          <div class="product-price">${formatCurrency(product.price)}</div>
          <button data-product-id="${product.id}" ${product.stock <= 0 ? 'disabled' : ''}>Add to cart</button>
        </div>
      `
    )
    .join('');

  productGrid.querySelectorAll('button[data-product-id]').forEach((button) => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.productId)));
  });
}

function addToCart(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;

  const existing = state.cart.find((item) => item.productId === productId);

  if (existing) {
    if (existing.quantity >= product.stock) {
      return;
    }
    existing.quantity += 1;
  } else {
    state.cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock
    });
  }

  renderCart();
}

function updateCartQuantity(productId, change) {
  const item = state.cart.find((entry) => entry.productId === productId);
  if (!item) return;

  const nextQuantity = item.quantity + change;
  if (nextQuantity <= 0) {
    state.cart = state.cart.filter((entry) => entry.productId !== productId);
  } else {
    const product = state.products.find((entry) => entry.id === productId);
    if (product && nextQuantity <= product.stock) {
      item.quantity = nextQuantity;
    }
  }

  renderCart();
}

function renderCart() {
  if (!state.cart.length) {
    cartItems.innerHTML = '<div class="empty-cart">Cart is empty.</div>';
    updateTotals();
    return;
  }

  cartItems.innerHTML = state.cart
    .map(
      (item) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <strong>${item.name}</strong>
            <span>${formatCurrency(item.price)} each</span>
          </div>
          <div class="cart-item-controls">
            <button data-action="decrease" data-product-id="${item.productId}">-</button>
            <span>${item.quantity}</span>
            <button data-action="increase" data-product-id="${item.productId}">+</button>
          </div>
        </div>
      `
    )
    .join('');

  cartItems.querySelectorAll('button[data-product-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = Number(button.dataset.productId);
      const action = button.dataset.action;
      updateCartQuantity(productId, action === 'increase' ? 1 : -1);
    });
  });

  updateTotals();
}

function updateTotals() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById('subtotalValue').textContent = formatCurrency(subtotal);
  document.getElementById('totalValue').textContent = formatCurrency(subtotal);
}

function renderRecentSales(sales) {
  if (!sales.length) {
    salesList.innerHTML = '<div class="empty-cart">No sales yet.</div>';
    return;
  }

  salesList.innerHTML = sales
    .map(
      (sale) => `
        <div class="sale-card">
          <div class="sale-card-header">
            <span>${sale.customer_name || 'Walk-in'}</span>
            <span>${formatCurrency(sale.total)}</span>
          </div>
          <small>${sale.payment_method}</small>
          <small>${new Date(sale.created_at).toLocaleString()}</small>
        </div>
      `
    )
    .join('');
}

async function completeSale() {
  if (!state.cart.length) {
    alert('Your cart is empty.');
    return;
  }

  const payload = {
    items: state.cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    customerName: customerNameInput.value.trim(),
    paymentMethod: paymentMethodSelect.value
  };

  try {
    const response = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Unable to complete sale.');
    }

    alert(`Sale completed successfully. Total: ${formatCurrency(data.total)}`);
    state.cart = [];
    customerNameInput.value = '';
    renderCart();
    fetchProducts();
    fetchDashboard();
  } catch (error) {
    alert(error.message);
  }
}

searchInput.addEventListener('input', renderProducts);
checkoutBtn.addEventListener('click', completeSale);

fetchProducts();
fetchDashboard();
