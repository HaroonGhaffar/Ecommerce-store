import './components/header.js';
import './components/footer.js';
import { apiRequest, requireAuth, hydrateAuthState } from './auth.js';

const authAllowed = requireAuth('login.html');
if (authAllowed) {
  hydrateAuthState();
}

const contentEl = document.getElementById('order-details-content');

function getOrderId() {
  const qp = new URLSearchParams(window.location.search);
  return qp.get('id');
}

function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

function getStatusClass(status) {
  return `status--${(status || 'pending').toLowerCase()}`;
}

async function init() {
  if (!authAllowed) return;

  const orderId = getOrderId();
  if (!orderId) {
    contentEl.innerHTML = '<p class="error">Order ID is missing.</p>';
    return;
  }

  try {
    const orders = await apiRequest('/orders/myorders', { method: 'GET' });
    const order = (orders || []).find(o => o._id === orderId);

    if (!order) {
      contentEl.innerHTML = '<p class="error">Order not found.</p>';
      return;
    }

    renderOrderDetails(order);
  } catch (err) {
    console.error(err);
    contentEl.innerHTML = '<p class="error">Could not retrieve order details. Please try again later.</p>';
  }
}

function renderOrderDetails(order) {
  const statusClass = getStatusClass(order.orderStatus);
  const itemsHTML = (order.orderItems || []).map(item => `
    <div class="item-row">
      <div class="item-info">
        <div class="item-title">${item.name}</div>
        <div class="item-meta">Quantity: ${item.qty} &times; $${item.price.toFixed(2)}</div>
      </div>
      <div class="item-price">$${(item.qty * item.price).toFixed(2)}</div>
    </div>
  `).join('');

  const shipping = order.shippingAddress || {};
  const shippingAddressHTML = `
    <p><strong>Address:</strong> ${shipping.address || 'N/A'}</p>
    <p><strong>City:</strong> ${shipping.city || 'N/A'}</p>
    <p><strong>Postal Code:</strong> ${shipping.postalCode || 'N/A'}</p>
    <p><strong>Country:</strong> ${shipping.country || 'N/A'}</p>
  `;

  contentEl.innerHTML = `
    <div class="details-header">
      <div>
        <h1>Order #${order._id.toUpperCase()}</h1>
        <p style="margin: 0.5rem 0 0; color: #718096; font-size: 0.9rem;">
          Placed on ${formatDate(order.createdAt)}
        </p>
      </div>
      <span class="details-status ${statusClass}">${order.orderStatus || 'Pending'}</span>
    </div>

    <div class="details-grid">
      <div class="details-box">
        <div class="section-title">Shipping Address</div>
        ${shippingAddressHTML}
      </div>
      <div class="details-box">
        <div class="section-title">Payment Info</div>
        <p><strong>Method:</strong> Cash on Delivery (COD)</p>
        <p><strong>Payment Status:</strong> <span style="font-weight: 600;">${order.paymentStatus || 'Pending'}</span></p>
      </div>
    </div>

    <div class="section-title">Order Items</div>
    <div class="items-list">
      ${itemsHTML}
    </div>

    <div class="totals-box">
      <div class="total-row">
        <span>Subtotal</span>
        <span>$${(order.totalPrice || 0).toFixed(2)}</span>
      </div>
      <div class="total-row">
        <span>Shipping</span>
        <span>Free</span>
      </div>
      <div class="total-row grand-total">
        <span>Total</span>
        <span>$${(order.totalPrice || 0).toFixed(2)}</span>
      </div>
    </div>
  `;
}

init();
