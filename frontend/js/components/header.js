import { getCurrentUser, hydrateAuthState, isLoggedIn, logout } from '../auth.js';

const HEADER_HTML = `
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="site-header__brand" href="/index.html" aria-label="MyStore home">
        <span class="site-header__brand-mark">M</span>
        <span>MyStore</span>
      </a>

      <div class="site-header__search">
        <input id="search" type="search" placeholder="Search products..." aria-label="Search products">
      </div>

      <nav class="site-header__nav" aria-label="Primary navigation">
        <a class="btn secondary site-header__link" href="/index.html">Home</a>
        <a class="btn secondary site-header__link site-header__cart" href="/cart.html">
          Cart
          <span class="site-header__badge" data-cart-badge hidden>0</span>
        </a>
        <a class="btn secondary site-header__link" href="/login.html" data-login-link>Login</a>
        <a class="btn secondary site-header__link" href="/register.html" data-register-link>Register</a>
        <a class="btn secondary site-header__link" href="/my-orders.html" data-my-orders-link hidden>My Orders</a>
        <a class="btn secondary site-header__link" href="/profile.html" data-profile-link hidden>Profile</a>
        <button class="btn secondary site-header__action" type="button" data-logout-button hidden>Logout</button>
      </nav>
    </div>
  </header>
`;

function getCartCount() {
  const raw = localStorage.getItem('cart');
  if (!raw) return 0;

  try {
    const cart = JSON.parse(raw);
    return Object.values(cart).reduce((sum, quantity) => sum + Number(quantity || 0), 0);
  } catch (_error) {
    return 0;
  }
}

function updateHeaderState(root) {
  const loginLink = root.querySelector('[data-login-link]');
  const registerLink = root.querySelector('[data-register-link]');
  const myOrdersLink = root.querySelector('[data-my-orders-link]');
  const profileLink = root.querySelector('[data-profile-link]');
  const logoutButton = root.querySelector('[data-logout-button]');
  const badge = root.querySelector('[data-cart-badge]');
  const loggedIn = isLoggedIn();
  const currentUser = getCurrentUser();

  if (loginLink) loginLink.hidden = loggedIn;
  if (registerLink) registerLink.hidden = loggedIn;
  if (myOrdersLink) myOrdersLink.hidden = !loggedIn;
  if (profileLink) {
    profileLink.hidden = !loggedIn;
    profileLink.textContent = currentUser?.name ? `Profile (${currentUser.name})` : 'Profile';
  }
  if (logoutButton) logoutButton.hidden = !loggedIn;

  if (badge) {
    const count = getCartCount();
    badge.textContent = String(count);
    badge.hidden = count === 0;
  }
}

function mountHeader() {
  const mountPoint = document.getElementById('site-header');
  if (!mountPoint || mountPoint.dataset.headerMounted === 'true') return;

  mountPoint.innerHTML = HEADER_HTML;
  mountPoint.dataset.headerMounted = 'true';

  const root = mountPoint.querySelector('.site-header');
  const search = root.querySelector('#search');
  const logoutButton = root.querySelector('[data-logout-button]');

  if (logoutButton) {
    logoutButton.addEventListener('click', logout);
  }

  if (search) {
    search.addEventListener('input', () => {
      window.dispatchEvent(new CustomEvent('site:search', { detail: { value: search.value.trim() } }));
    });
  }

  updateHeaderState(root);

  window.addEventListener('storage', (event) => {
    if (event.key === 'cart' || event.key === 'token' || event.key === 'currentUser') {
      updateHeaderState(root);
    }
  });

  window.addEventListener('cart:updated', () => updateHeaderState(root));
  window.addEventListener('auth:updated', () => updateHeaderState(root));

  hydrateAuthState();
  updateHeaderState(root);
}

mountHeader();

export { mountHeader, updateHeaderState };
