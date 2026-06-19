import './components/header.js';
import './components/footer.js';
import { showToast } from './components/toast.js';
import { fetchProductById } from './api.js';
import { hydrateAuthState, isLoggedIn, apiRequest } from './auth.js';

const el = id => document.getElementById(id);
const addToCartBtn = document.getElementById('add-to-cart');

hydrateAuthState();

function getId(){
  const qp = new URLSearchParams(window.location.search);
  return qp.get('id');
}

function render(product){
  el('p-image').src = product.image || 'https://via.placeholder.com/900x900?text=Product';
  el('p-title').textContent = product.title;
  el('p-desc').textContent = product.description || '';
  el('p-price').textContent = `$${product.price.toFixed(2)}`;
  el('p-stock').textContent = product.stock > 0 ? 'In stock' : 'Out of stock';
  if (addToCartBtn) {
    addToCartBtn.onclick = async () => {
      if (isLoggedIn()) {
        try {
          addToCartBtn.disabled = true;
          addToCartBtn.textContent = 'Adding...';
          const cartData = await apiRequest('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId: product._id, quantity: 1 })
          });
          const localCart = {};
          (cartData.items || []).forEach(i => {
            const pId = i.product._id || i.product;
            localCart[pId] = i.quantity;
          });
          localStorage.setItem('cart', JSON.stringify(localCart));
          window.dispatchEvent(new Event('cart:updated'));
          addToCartBtn.textContent = 'Added';
          showToast('Added to cart');
        } catch (err) {
          console.error(err);
          showToast(err.message || 'Failed to add to cart', 'error');
          addToCartBtn.disabled = false;
          addToCartBtn.textContent = 'Add to cart';
        }
      } else {
        const raw = localStorage.getItem('cart') || '{}';
        const cart = JSON.parse(raw);
        cart[product._id] = (cart[product._id] || 0) + 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart:updated'));
        addToCartBtn.textContent = 'Added';
        addToCartBtn.disabled = true;
        showToast('Added to cart');
      }
    };
  }
}

async function init(){
  const id = getId();
  if(!id){
    document.body.innerHTML = '<p>Product id missing</p>';
    return;
  }
  try{
    const product = await fetchProductById(id);
    render(product);
  }catch(err){
    console.error(err);
    document.body.innerHTML = '<p>Could not load product.</p>';
  }
}

init();
