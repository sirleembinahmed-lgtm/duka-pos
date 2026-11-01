:root {
  --bg: #f3f7fb;
  --panel: #ffffff;
  --border: #dfe8f3;
  --primary: #1d4ed8;
  --primary-dark: #153ea7;
  --accent: #10b981;
  --accent-dark: #0d8d67;
  --text: #0f172a;
  --muted: #64748b;
  --danger: #ef4444;
  --warning: #f59e0b;
  --shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: var(--bg);
  color: var(--text);
}

button,
input,
select {
  font: inherit;
}

.hidden {
  display: none !important;
}

.auth-screen {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #edf3ff, #f8fbff);
  padding: 20px;
}

.auth-card {
  width: min(420px, 100%);
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 22px;
  box-shadow: var(--shadow);
  padding: 24px;
}

.auth-header {
  margin-bottom: 20px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--muted);
}

h1, h2, h3, p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0;
  font-size: clamp(2rem, 2vw + 1rem, 2.8rem);
}

#loginForm {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

#loginForm label,
.product-form label,
.checkout-fields label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--muted);
  font-size: 14px;
}

input,
select {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 11px 12px;
  background: white;
  color: var(--text);
}

.primary-btn,
.secondary-btn,
.product-card button,
.inventory-row button,
.cart-item-controls button,
.checkout-btn {
  cursor: pointer;
  border: none;
  border-radius: 10px;
  transition: 0.2s ease;
}

.primary-btn {
  background: var(--primary);
  color: white;
  padding: 12px 16px;
  font-weight: 700;
}

.primary-btn:hover {
  background: var(--primary-dark);
}

.secondary-btn {
  background: #e2e8f0;
  color: var(--text);
  padding: 10px 14px;
}

.secondary-btn:hover {
  background: #cbd5e1;
}

.credentials-box {
  background: #f8fafc;
  border: 1px dashed var(--border);
  border-radius: 12px;
  padding: 12px;
  margin-top: 18px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.8;
}

.app-shell {
  max-width: 1450px;
  margin: 0 auto;
  padding: 28px 18px 40px;
}

.topbar,
.panel-head,
.header-actions,
.inventory-header,
.form-actions,
.total-row,
.checkout-fields,
.user-badge {
  display: flex;
  align-items: center;
}

.topbar {
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.header-actions {
  gap: 12px;
}

.user-badge {
  background: #e0edff;
  color: var(--primary-dark);
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 22px;
}

.stat-card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px 20px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-card.accent {
  background: linear-gradient(135deg, #dbeafe, #eff6ff);
}

.stat-card span {
  color: var(--muted);
  font-size: 13px;
}

.stat-card strong {
  font-size: clamp(1.4rem, 1.5vw + 1rem, 2.1rem);
}

.main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.85fr);
  gap: 20px;
}

.panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 16px;
  box-shadow: var(--shadow);
}

.panel-head {
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.panel-head.compact {
  margin-bottom: 12px;
}

.sales-panel,
.inventory-panel {
  display: flex;
  flex-direction: column;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 12px;
}

.product-card {
  border: 1px solid var(--border);
  border-radius: 14px;
  background: linear-gradient(180deg, #fff, #f8fafc);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-card h3 {
  margin: 0;
  font-size: 1rem;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: var(--muted);
  font-size: 12px;
}

.product-price {
  color: var(--primary-dark);
  font-weight: 700;
  font-size: 1.2rem;
}

.product-card button {
  background: var(--primary);
  color: white;
  padding: 10px 12px;
}

.product-card button:hover {
  background: var(--primary-dark);
}

.product-card button:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.cart-box {
  margin-top: 18px;
  border-top: 1px solid var(--border);
  padding-top: 18px;
}

.checkout-fields {
  gap: 14px;
  margin-bottom: 16px;
}

.checkout-fields label {
  flex: 1;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 160px;
}

.empty-cart {
  border: 1px dashed var(--border);
  border-radius: 12px;
  padding: 20px;
  color: var(--muted);
  text-align: center;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
}

.cart-item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-item-controls button {
  width: 28px;
  height: 28px;
  background: #e2e8f0;
}

.totals {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.total-row {
  justify-content: space-between;
}

.total-row.total {
  font-size: 1.3rem;
}

.wide {
  width: 100%;
  margin-top: 12px;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.split-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.form-actions {
  justify-content: space-between;
  gap: 12px;
}

.inventory-list-wrap {
  margin-top: 12px;
}

.inventory-header {
  justify-content: space-between;
  margin-bottom: 12px;
}

.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.inventory-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  background: #f8fafc;
}

.inventory-row strong {
  display: block;
  margin-bottom: 2px;
}

.inventory-row small {
  display: block;
  color: var(--muted);
}

.inventory-actions {
  display: flex;
  gap: 8px;
}

.inventory-row button {
  padding: 8px 10px;
}

.edit-btn {
  background: #dbeafe;
  color: var(--primary-dark);
}

.delete-btn {
  background: #fee2e2;
  color: #b91c1c;
}

.recent-panel {
  margin-top: 22px;
}

.sales-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.sale-card {
  border: 1px solid var(--border);
  border-radius: 14px;
  background: #f8fafc;
  padding: 14px;
}

.sale-card-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.sale-card small {
  display: block;
  color: var(--muted);
  margin-top: 4px;
}

@media (max-width: 980px) {
  .main-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .topbar,
  .panel-head,
  .header-actions,
  .checkout-fields,
  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .split-row {
    grid-template-columns: 1fr;
  }
}

