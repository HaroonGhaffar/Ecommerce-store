import './components/header.js';
import './components/footer.js';
import { showToast } from './components/toast.js';
import { fetchProducts } from './api.js';
import { hydrateAuthState, isLoggedIn, apiRequest } from './auth.js';

const productsContainer = document.getElementById('products-grid');
const searchInput = document.getElementById('search');
let allProducts = [];
let activeQuery = '';

hydrateAuthState();

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function createCard(p){
  const a = document.createElement('a');
  a.href = `/product.html?id=${p._id}`;
  a.className = 'product-link';
  const card = document.createElement('div');
  card.className = 'card';
  const img = document.createElement('img');
  img.src = p.image || 'https://via.placeholder.com/900x900?text=Product';
  img.alt = p.title;
  const title = document.createElement('h3');
  title.className = 'title';
  title.textContent = p.title;
  const category = document.createElement('div');
  category.className = 'meta';
  category.textContent = p.category || 'Uncategorized';
  const price = document.createElement('div');
  price.className = 'price';
  price.textContent = `$${p.price.toFixed(2)}`;
  const actions = document.createElement('div');
  actions.className = 'actions';
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Add to cart';
  btn.onclick = (e)=>{
    e.preventDefault();
    addToCart(p._id, btn);
  };
  actions.appendChild(btn);
  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(category);
  card.appendChild(price);
  card.appendChild(actions);
  a.appendChild(card);
  return a;
}

async function addToCart(productId, button){
  if (isLoggedIn()) {
    try {
      if (button) {
        button.disabled = true;
        button.textContent = 'Adding...';
      }
      const cartData = await apiRequest('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity: 1 })
      });
      const localCart = {};
      (cartData.items || []).forEach(i => {
        const pId = i.product._id || i.product;
        localCart[pId] = i.quantity;
      });
      localStorage.setItem('cart', JSON.stringify(localCart));
      window.dispatchEvent(new Event('cart:updated'));
      if (button) {
        button.textContent = 'Added';
      }
      showToast('Added to cart');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to add to cart', 'error');
      if (button) {
        button.disabled = false;
        button.textContent = 'Add to cart';
      }
    }
  } else {
    const raw = localStorage.getItem('cart') || '{}';
    const cart = JSON.parse(raw);
    cart[productId] = (cart[productId]||0) + 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart:updated'));
    if (button) {
      button.textContent = 'Added';
      button.disabled = true;
    }
    showToast('Added to cart');
  }
}

function renderProducts(query = '') {
  if (!productsContainer) return;

  const normalizedQuery = normalize(query);
  const filteredProducts = !normalizedQuery
    ? allProducts
    : allProducts.filter((product) => {
        const title = normalize(product.title);
        const category = normalize(product.category);
        return title.includes(normalizedQuery) || category.includes(normalizedQuery);
      });

  productsContainer.innerHTML = '';

  if (!filteredProducts.length) {
    productsContainer.innerHTML = '<p class="empty-state">No products found.</p>';
    return;
  }

  filteredProducts.forEach((product) => productsContainer.appendChild(createCard(product)));
}

function applySearch(value) {
  activeQuery = value || '';
  renderProducts(activeQuery);
}

async function load(){
  try{
    allProducts = await fetchProducts();
    renderProducts(activeQuery);
  }catch(err){
    productsContainer.innerHTML = `<p>Could not load products.</p>`;
    console.error(err);
  }
}

window.addEventListener('site:search', (event) => {
  applySearch(event?.detail?.value || '');
});

if (searchInput) {
  searchInput.addEventListener('input', () => {
    applySearch(searchInput.value);
  });
}

load();
