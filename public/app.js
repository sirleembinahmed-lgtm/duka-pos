* {
  box-sizing: border-box;
}

:root {
  --bg: #f4f7fb;
  --panel: #ffffff;
  --border: #dde5f0;
  --primary: #1d4ed8;
  --primary-dark: #163ea8;
  --accent: #10b981;
  --text: #1e293b;
  --muted: #64748b;
  --danger: #ef4444;
  --warning: #f59e0b;
  --shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
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

.app-shell {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px 40px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--muted);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0;
  font-size: clamp(2rem, 3vw, 2.8rem);
}

.header-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.header-actions label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--muted);
  min-width: 160px;
}

input,
select {
  border: 1px solid var(--border);
  border-radius: 10px;
  background: #fff;
  padding: 11px 12px;
  color: var(--text);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-card.accent {
  background: linear-gradient(135deg, #dbeafe, #eff6ff);
}

.stat-card span {
  color: var(--muted);
  font-size: 13px;
}

.stat-card strong {
  font-size: clamp(1.4rem, 2vw, 2rem);
}

.main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.8fr);
  gap: 20px;
}

.panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 16px;
  box-shadow: var(--shadow);
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.panel-head h2 {
  margin-bottom: 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 14px;
}

.product-card {
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px;
  background: linear-gradient(180deg, #ffffff, #f8fafc);
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
  align-items: center;
  color: var(--muted);
  font-size: 12px;
}

.product-price {
  color: var(--primary-dark);
  font-weight: bold;
  font-size: 1.15rem;
}

.product-card button {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  transition: 0.2s ease;
}

.product-card button:hover {
  background: var(--primary-dark);
}

.product-card button:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.cart-panel {
  display: flex;
  flex-direction: column;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 180px;
  margin-bottom: 20px;
}

.empty-cart {
  color: var(--muted);
  border: 1px dashed var(--border);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
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
  border: none;
  border-radius: 8px;
  background: #e2e8f0;
  cursor: pointer;
}

.totals {
  margin-top: auto;
  border-top: 1px solid var(--border);
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-row.total {
  margin-top: 6px;
  font-size: 1.25rem;
}

.checkout-btn {
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  padding: 14px 18px;
  margin-top: 18px;
  cursor: pointer;
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
  padding: 14px;
  background: #f8fafc;
}

.sale-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: bold;
}

.sale-card small {
  display: block;
  color: var(--muted);
  margin-top: 4px;
}

@media (max-width: 900px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(160px, 1fr));
  }
}

@media (max-width: 560px) {
  .topbar,
  .panel-head {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
