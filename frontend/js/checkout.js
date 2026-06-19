import './components/header.js';
import './components/footer.js';
import { fetchProductById } from './api.js';
import { hydrateAuthState, isLoggedIn, requireAuth, apiRequest } from './auth.js';

const summaryEl = document.getElementById('order-summary');
const subtotalEl = document.getElementById('checkout-subtotal');
const totalEl = document.getElementById('checkout-total');
const placeOrderBtn = document.getElementById('place-order');
const form = document.getElementById('checkout-form');
const statusEl = document.getElementById('checkout-status');

const authAllowed = requireAuth('login.html');
if (authAllowed) {
  hydrateAuthState();
}

function getCart(){
  return JSON.parse(localStorage.getItem('cart') || '{}');
}

function money(value){
  return `$${value.toFixed(2)}`;
}

async function buildSummary(){
  const cart = getCart();
  const ids = Object.keys(cart);
  const products = await Promise.all(ids.map(id => fetchProductById(id)));
  const lines = ids.map((id, index) => ({ product: products[index], quantity: cart[id] }));
  const subtotal = lines.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal;

  summaryEl.innerHTML = '';
  if (!lines.length){
    summaryEl.innerHTML = '<p class="muted">Your cart is empty.</p>';
  } else {
    lines.forEach(line => {
      const row = document.createElement('div');
      row.className = 'order-line';
      row.innerHTML = `<span>${line.product.title} × ${line.quantity}</span><strong>${money(line.product.price * line.quantity)}</strong>`;
      summaryEl.appendChild(row);
    });
  }

  subtotalEl.textContent = money(subtotal);
  totalEl.textContent = money(total);
}

function saveDraft(data){
  localStorage.setItem('checkoutDraft', JSON.stringify(data));
}

if (authAllowed) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cart = getCart();
    if (!Object.keys(cart).length){
      statusEl.textContent = 'Your cart is empty.';
      return;
    }

    const shippingAddress = {
      address: form.address.value.trim(),
      city: form.city.value.trim(),
      postalCode: form.postalCode.value.trim(),
      country: form.country.value.trim(),
    };

    try {
      statusEl.textContent = 'Placing your order...';
      await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({ shippingAddress })
      });
      
      // Clear client cart cache:
      localStorage.setItem('cart', '{}');
      window.dispatchEvent(new Event('cart:updated'));
      
      alert('Order Placed Successfully');
      window.location.href = '/my-orders.html';
    } catch (err) {
      console.error(err);
      statusEl.textContent = err.message || 'Failed to place order. Please try again.';
    }
  });

  if (!isLoggedIn()) {
    placeOrderBtn.disabled = true;
  }

  buildSummary().catch(err => {
    console.error(err);
    summaryEl.innerHTML = '<p class="muted">Could not load order summary.</p>';
  });
}
