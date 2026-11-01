const state = {
  user: null,
  products: [],
  cart: []
};

const loginScreen = document.getElementById('loginScreen');
const appScreen = document.getElementById('appScreen');
const loginForm = document.getElementById('loginForm');
const currentUser = document.getElementById('currentUser');
const logoutBtn = document.getElementById('logoutBtn');

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const cartItems = document.getElementById('cartItems');
const customerNameInput = document.getElementById('customerName');
const paymentMethodSelect = document.getElementById('paymentMethod');
const checkoutBtn = document.getElementById('checkoutBtn');

const productForm = document.getElementById('productForm');
const productIdInput = document.getElementById('productId');
const productNameInput = document.getElementById('productName');
const productBarcodeInput = document.getElementById('productBarcode');
const productCategoryInput = document.getElementById('productCategory');
const productPriceInput = document.getElementById('productPrice');
const productStockInput = document.getElementById('productStock');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const inventoryList = document.getElementById('inventoryList');

const orderNumberSelector = '#';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2
  }).format(Number(value || 0));
}

function showApp() {
  loginScreen.classList.add('hidden');
  appScreen.classList.remove('hidden');
  currentUser.textContent = state.user ? `${state.user.role.toUpperCase()} - ${state.user.username}` : 'User';
}

function showLogin() {
  appScreen.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  state.user = null;
  state.cart = [];
  renderCart();
}

async function login(username, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  state.user = data.user;
  showApp();
  await Promise.all([loadProducts(), loadDashboard()]);
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('usernameInput').value.trim();
  const password = document.getElementById('passwordInput').value.trim();

  try {
    await login(username, password);
    document.getElementById('loginForm').reset();
  } catch (error) {
    alert(error.message);
  }
});

logoutBtn.addEventListener('click', () => {
  showLogin();
  document.getElementById('loginForm').reset();
});

async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    state.products = products;
    renderProducts();
    renderInventoryList();
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

async function loadDashboard() {
  try {
    const response = await fetch('/api/dashboard');
    const data = await response.json();

    document.getElementById('todaySales').textContent = formatCurrency(data.salesToday?.total_sales || 0);
    document.getElementById('itemsSold').textContent = data.itemsSold?.items_sold || 0;
    document.getElementById('stockUnits').textContent = data.productStock?.total_units || 0;
    document.getElementById('salesCount').textContent = data.salesToday?.sales_count || 0;

    renderRecentSales(data.recentSales || []);
  } catch (error) {
    console.error('Failed to fetch dashboard:', error);
  }
}

function renderProducts() {
  const searchTerm = (searchInput.value || '').toLowerCase();

  const filteredProducts = state.products.filter((product) => {
    const matchName = (product.name || '').toLowerCase().includes(searchTerm);
    const matchBarcode = (product.barcode || '').toLowerCase().includes(searchTerm);
    return matchName || matchBarcode;
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
    if (existing.quantity >= product.stock) return;
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

function updateCartQuantity(productId, delta) {
  const item = state.cart.find((entry) => entry.productId === productId);
  if (!item) return;

  const nextQty = item.quantity + delta;

  if (nextQty <= 0) {
    state.cart = state.cart.filter((entry) => entry.productId !== productId);
  } else {
    const product = state.products.find((entry) => entry.id === productId);
    if (product && nextQty <= product.stock) {
      item.quantity = nextQty;
    }
  }

  renderCart();
}

function renderCart() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById('subtotalValue').textContent = formatCurrency(subtotal);
  document.getElementById('totalValue').textContent = formatCurrency(subtotal);

  if (!state.cart.length) {
    cartItems.innerHTML = '<div class="empty-cart">Cart is empty.</div>';
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
}

async function completeSale() {
  if (!state.cart.length) {
    alert('Your cart is empty.');
    return;
  }

  try {
    const response = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: state.cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        paymentMethod: paymentMethodSelect.value,
        customerName: customerNameInput.value.trim()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Unable to complete sale.');
    }

    alert(`Sale completed successfully. Total: ${formatCurrency(data.total)}`);
    state.cart = [];
    customerNameInput.value = '';
    renderCart();
    await Promise.all([loadProducts(), loadDashboard()]);
  } catch (error) {
    alert(error.message);
  }
}

checkoutBtn.addEventListener('click', completeSale);
searchInput.addEventListener('input', renderProducts);

function resetProductForm() {
  productIdInput.value = '';
  productNameInput.value = '';
  productBarcodeInput.value = '';
  productCategoryInput.value = '';
  productPriceInput.value = '';
  productStockInput.value = '';
  cancelEditBtn.classList.add('hidden');
}

function fillProductForm(product) {
  productIdInput.value = product.id;
  productNameInput.value = product.name;
  productBarcodeInput.value = product.barcode || '';
  productCategoryInput.value = product.category || '';
  productPriceInput.value = product.price;
  productStockInput.value = product.stock;
  cancelEditBtn.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function saveProduct(event) {
  event.preventDefault();

  if (!state.user || state.user.role !== 'admin') {
    alert('Only admin users can save products.');
    return;
  }

  const product = {
    name: productNameInput.value.trim(),
    barcode: productBarcodeInput.value.trim(),
    category: productCategoryInput.value.trim(),
    price: Number(productPriceInput.value),
    stock: Number(productStockInput.value)
  };

  if (!product.name || !product.price || product.price <= 0) {
    alert('Please enter a valid product name and price.');
    return;
  }

  try {
    const isEditing = Boolean(productIdInput.value);
    const route = isEditing ? `/api/products/${productIdInput.value}` : '/api/products';
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(route, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Unable to save product.');
    }

    resetProductForm();
    await Promise.all([loadProducts(), loadDashboard()]);
  } catch (error) {
    alert(error.message);
  }
}

async function deleteProduct(productId) {
  if (!state.user || state.user.role !== 'admin') {
    alert('Only admin users can delete products.');
    return;
  }

  const confirmed = confirm('Delete this product?');
  if (!confirmed) return;

  try {
    const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Unable to delete product.');
    }

    resetProductForm();
    await Promise.all([loadProducts(), loadDashboard()]);
  } catch (error) {
    alert(error.message);
  }
}

function renderInventoryList() {
  if (!state.user || state.user.role !== 'admin') {
    inventoryList.innerHTML = '<div class="empty-cart">Admin access required to manage inventory.</div>';
    return;
  }

  inventoryList.innerHTML = state.products
    .map(
      (product) => `
        <div class="inventory-row">
          <div>
            <strong>${product.name}</strong>
            <small>${product.category || 'General'} • Stock: ${product.stock}</small>
            <small>${formatCurrency(product.price)} • ${product.barcode || 'No barcode'}</small>
          </div>
          <div class="inventory-actions">
            <button class="edit-btn" data-edit-id="${product.id}">Edit</button>
            <button class="delete-btn" data-delete-id="${product.id}">Delete</button>
          </div>
        </div>
      `
    )
    .join('');

  inventoryList.querySelectorAll('[data-edit-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const product = state.products.find((item) => item.id === Number(button.dataset.editId));
      if (product) fillProductForm(product);
    });
  });

  inventoryList.querySelectorAll('[data-delete-id]').forEach((button) => {
    button.addEventListener('click', () => deleteProduct(Number(button.dataset.deleteId)));
  });
}

function renderRecentSales(sales) {
  const salesList = document.getElementById('salesList');
  if (!sales || !sales.length) {
    salesList.innerHTML = '<div class="empty-cart">No sales recorded yet.</div>';
    return;
  }

  salesList.innerHTML = sales
    .map(
      (sale) => `
        <div class="sale-card">
          <div class="sale-card-header">
            <strong>${sale.customer_name || 'Walk-in'}</strong>
            <strong>${formatCurrency(sale.total)}</strong>
          </div>
          <small>${sale.payment_method}</small>
          <small>${new Date(sale.created_at).toLocaleString()}</small>
        </div>
      `
    )
    .join('');
}

productForm.addEventListener('submit', saveProduct);
cancelEditBtn.addEventListener('click', resetProductForm);

showLogin();
renderCart();
renderProducts();
renderInventoryList();

