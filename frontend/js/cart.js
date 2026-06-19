import './components/header.js';
import './components/footer.js';
import { fetchProductById } from './api.js';
import { hydrateAuthState, isLoggedIn, apiRequest } from './auth.js';

const itemsEl = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal');
const shippingEl = document.getElementById('shipping');
const totalEl = document.getElementById('total');

hydrateAuthState();

function getCart(){
  return JSON.parse(localStorage.getItem('cart') || '{}');
}

function setCart(cart){
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart:updated'));
}

async function getCartDetails(){
  if (isLoggedIn()) {
    try {
      const cartData = await apiRequest('/cart', { method: 'GET' });
      return (cartData.items || []).map(item => ({
        product: item.product,
        quantity: item.quantity
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  } else {
    const cart = getCart();
    const ids = Object.keys(cart);
    const products = await Promise.all(ids.map(id => fetchProductById(id)));
    return ids.map((id, index) => ({ product: products[index], quantity: cart[id] }));
  }
}

function money(value){
  return `$${value.toFixed(2)}`;
}

function updateTotals(lines){
  const subtotal = lines.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;
  subtotalEl.textContent = money(subtotal);
  shippingEl.textContent = shipping === 0 ? 'Free' : money(shipping);
  totalEl.textContent = money(total);
}

function renderEmpty(){
  itemsEl.innerHTML = '<div class="empty-state"><h2>Your cart is empty</h2><p>Add products from the catalog to continue.</p><a class="btn" href="/index.html">Browse products</a></div>';
  updateTotals([]);
}

function renderItem(line){
  const item = document.createElement('article');
  item.className = 'cart-item';
  item.innerHTML = `
    <img src="${line.product.image || 'https://via.placeholder.com/900x900?text=Product'}" alt="${line.product.title}">
    <div>
      <h3>${line.product.title}</h3>
      <div class="meta">Unit price: ${money(line.product.price)}</div>
      <div class="qty-controls">
        <button data-action="decrease" aria-label="Decrease quantity">-</button>
        <span>Qty: <strong>${line.quantity}</strong></span>
        <button data-action="increase" aria-label="Increase quantity">+</button>
        <button class="remove" data-action="remove">Remove</button>
      </div>
    </div>
    <div><strong>${money(line.product.price * line.quantity)}</strong></div>
  `;

  item.querySelector('[data-action="decrease"]').addEventListener('click', () => changeQuantity(line.product._id, -1));
  item.querySelector('[data-action="increase"]').addEventListener('click', () => changeQuantity(line.product._id, 1));
  item.querySelector('[data-action="remove"]').addEventListener('click', () => removeItem(line.product._id));
  return item;
}

async function renderCart(){
  const lines = await getCartDetails();
  if (!lines.length){
    renderEmpty();
    return;
  }
  itemsEl.innerHTML = '';
  lines.forEach(line => itemsEl.appendChild(renderItem(line)));
  updateTotals(lines);
}

async function changeQuantity(productId, delta){
  if (isLoggedIn()) {
    try {
      const cartData = await apiRequest('/cart', { method: 'GET' });
      const item = (cartData.items || []).find(i => (i.product._id || i.product) === productId);
      if (!item) return;
      const nextQty = item.quantity + delta;
      if (nextQty <= 0) {
        const updatedCart = await apiRequest('/cart/remove', {
          method: 'DELETE',
          body: JSON.stringify({ productId })
        });
        syncCartToLocal(updatedCart);
      } else {
        const updatedCart = await apiRequest('/cart/update', {
          method: 'PUT',
          body: JSON.stringify({ productId, quantity: nextQty })
        });
        syncCartToLocal(updatedCart);
      }
      window.dispatchEvent(new Event('cart:updated'));
      await renderCart();
    } catch (err) {
      console.error(err);
    }
  } else {
    const cart = getCart();
    const next = (cart[productId] || 0) + delta;
    if (next <= 0){
      delete cart[productId];
    } else {
      cart[productId] = next;
    }
    setCart(cart);
    renderCart().catch(console.error);
  }
}

async function removeItem(productId){
  if (isLoggedIn()) {
    try {
      const updatedCart = await apiRequest('/cart/remove', {
        method: 'DELETE',
        body: JSON.stringify({ productId })
      });
      syncCartToLocal(updatedCart);
      window.dispatchEvent(new Event('cart:updated'));
      await renderCart();
    } catch (err) {
      console.error(err);
    }
  } else {
    const cart = getCart();
    delete cart[productId];
    setCart(cart);
    renderCart().catch(console.error);
  }
}

function syncCartToLocal(cartData) {
  const localCart = {};
  (cartData.items || []).forEach(i => {
    const pId = i.product._id || i.product;
    localCart[pId] = i.quantity;
  });
  localStorage.setItem('cart', JSON.stringify(localCart));
}

renderCart().catch(err => {
  console.error(err);
  itemsEl.innerHTML = '<div class="empty-state"><h2>Unable to load cart</h2><p>Please try again later.</p></div>';
});
