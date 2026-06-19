import './components/header.js';
import './components/footer.js';
import { apiRequest, requireAuth, hydrateAuthState } from './auth.js';

const authAllowed = requireAuth('login.html');
if (authAllowed) {
  hydrateAuthState();
}

const ordersListEl = document.getElementById('orders-list');

function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

function getStatusClass(status) {
  return `status--${(status || 'pending').toLowerCase()}`;
}

async function loadOrders() {
  if (!authAllowed) return;

  try {
    const orders = await apiRequest('/orders/myorders', { method: 'GET' });
    renderOrders(orders);
  } catch (err) {
    console.error(err);
    ordersListEl.innerHTML = '<p class="error">Could not retrieve order details. Please try again later.</p>';
  }
}

function renderOrders(orders) {
  if (!orders || orders.length === 0) {
    ordersListEl.innerHTML = `
      <div class="empty-orders">
        <h2>No orders found</h2>
        <p>You haven't placed any orders yet.</p>
        <br>
        <a class="btn" href="/index.html">Start shopping</a>
      </div>
    `;
    return;
  }

  ordersListEl.innerHTML = '';
  // Sort orders by newest first
  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  sortedOrders.forEach(order => {
    const card = document.createElement('article');
    card.className = 'order-card';
    card.onclick = () => {
      window.location.href = `/order-details.html?id=${order._id}`;
    };

    const statusClass = getStatusClass(order.orderStatus);

    card.innerHTML = `
      <div class="order-card__meta">
        <span class="order-card__id">Order #${order._id.slice(-6).toUpperCase()}</span>
        <span class="order-card__status ${statusClass}">${order.orderStatus || 'Pending'}</span>
      </div>
      <div class="order-card__details">
        <span>Date: <strong>${formatDate(order.createdAt)}</strong></span>
        <span>Total: <strong>$${(order.totalPrice || 0).toFixed(2)}</strong></span>
      </div>
    `;

    ordersListEl.appendChild(card);
  });
}

loadOrders();
