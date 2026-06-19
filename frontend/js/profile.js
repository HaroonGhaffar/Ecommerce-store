import './components/header.js';
import './components/footer.js';
import { getCurrentUser, getProfile, isLoggedIn, requireAuth, hydrateAuthState, apiRequest } from './auth.js';

const summary = document.getElementById('profile-summary');
const recentOrdersList = document.getElementById('recent-orders-list');

requireAuth('login.html');
hydrateAuthState();

async function loadProfile() {
  const currentUser = getCurrentUser();
  if (!isLoggedIn()) {
    return;
  }

  try {
    const profile = await getProfile();
    summary.textContent = `${profile.name} (${profile.email}) — Role: ${profile.role.toUpperCase()}`;
  } catch (_error) {
    if (currentUser?.name) {
      summary.textContent = `${currentUser.name} (${currentUser.email})`;
    } else {
      summary.textContent = 'Profile data unavailable.';
    }
  }

  // Load recent orders
  try {
    const orders = await apiRequest('/orders/myorders', { method: 'GET' });
    renderRecentOrders(orders);
  } catch (err) {
    console.error('Failed to load recent orders on profile:', err);
    recentOrdersList.innerHTML = '<p style="color: #e53e3e;">Could not load recent orders.</p>';
  }
}

function renderRecentOrders(orders) {
  if (!orders || orders.length === 0) {
    recentOrdersList.innerHTML = '<p style="color: #718096; font-style: italic;">No orders placed yet.</p>';
    return;
  }

  const topOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  recentOrdersList.innerHTML = '';
  topOrders.forEach(order => {
    const div = document.createElement('div');
    div.style.padding = '0.75rem';
    div.style.border = '1px solid #edf2f7';
    div.style.borderRadius = '6px';
    div.style.marginBottom = '0.5rem';
    div.style.cursor = 'pointer';
    div.style.display = 'flex';
    div.style.justify = 'space-between';
    div.style.alignItems = 'center';
    div.style.transition = 'background 0.2s';
    
    div.onmouseenter = () => div.style.background = '#f7fafc';
    div.onmouseleave = () => div.style.background = 'transparent';
    div.onclick = () => {
      window.location.href = `/order-details.html?id=${order._id}`;
    };

    const isDelivered = order.orderStatus === 'Delivered';
    const statusStyle = isDelivered ? 'color: #22543d; font-weight: bold;' : 'color: #c05621; font-weight: bold;';

    div.innerHTML = `
      <div>
        <div style="font-weight: 600; color: var(--accent);">Order #${order._id.slice(-6).toUpperCase()}</div>
        <div style="font-size: 0.8rem; color: #718096;">${new Date(order.createdAt).toLocaleDateString()}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-weight: 700; color: var(--text);">$${(order.totalPrice || 0).toFixed(2)}</div>
        <div style="font-size: 0.8rem; ${statusStyle}">${order.orderStatus || 'Pending'}</div>
      </div>
    `;
    recentOrdersList.appendChild(div);
  });
}

loadProfile();
