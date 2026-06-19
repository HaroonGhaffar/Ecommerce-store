const API_BASE = window.API_BASE || 'http://localhost:5000/api';

function getToken(){
  return localStorage.getItem('token') || '';
}

function getCurrentUser(){
  try {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  } catch (_error) {
    return null;
  }
}

function setToken(token){
  localStorage.setItem('token', token);
}

function clearAuth(){
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  window.dispatchEvent(new CustomEvent('auth:updated'));
}

function isLoggedIn(){
  return Boolean(getToken());
}

function authHeaders(){
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiRequest(path, options = {}){
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...authHeaders(),
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (_error) {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || 'Request failed';
    throw new Error(message);
  }

  return payload;
}

async function login(email, password){
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  localStorage.setItem('currentUser', JSON.stringify({
    _id: data._id,
    name: data.name,
    email: data.email,
    role: data.role,
  }));
  await syncLocalCartToDB();
  window.dispatchEvent(new CustomEvent('auth:updated'));
  return data;
}

async function register(name, email, password){
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  setToken(data.token);
  localStorage.setItem('currentUser', JSON.stringify({
    _id: data._id,
    name: data.name,
    email: data.email,
    role: data.role,
  }));
  await syncLocalCartToDB();
  window.dispatchEvent(new CustomEvent('auth:updated'));
  return data;
}

async function getProfile(){
  return apiRequest('/auth/profile', { method: 'GET' });
}

async function syncLocalCartToDB() {
  const token = getToken();
  if (!token) return;
  const localCart = JSON.parse(localStorage.getItem('cart') || '{}');
  const ids = Object.keys(localCart);
  if (ids.length > 0) {
    for (const productId of ids) {
      try {
        await apiRequest('/cart/add', {
          method: 'POST',
          body: JSON.stringify({ productId, quantity: localCart[productId] })
        });
      } catch (err) {
        console.error(`Failed to add item ${productId} to DB cart during sync:`, err);
      }
    }
  }
  try {
    const cartData = await apiRequest('/cart', { method: 'GET' });
    const mergedCart = {};
    (cartData.items || []).forEach(i => {
      const pId = i.product._id || i.product;
      mergedCart[pId] = i.quantity;
    });
    localStorage.setItem('cart', JSON.stringify(mergedCart));
  } catch (err) {
    console.error('Failed to retrieve merged cart:', err);
  }
}

function logout(){
  clearAuth();
  localStorage.setItem('cart', '{}');
  window.location.href = '/login.html';
}

function requireAuth(redirectTo = 'login.html'){
  if (!isLoggedIn()) {
    const next = encodeURIComponent(window.location.pathname.split('/').pop());
    window.location.href = `/${redirectTo}?next=${next}`;
    return false;
  }
  return true;
}

function redirectIfAuthenticated(target = 'index.html'){
  if (isLoggedIn()) {
    window.location.href = `/${target}`;
    return true;
  }
  return false;
}

function hydrateAuthState(){
  // Support multiple attribute variants used across pages and the shared header
  const authLinks = Array.from(document.querySelectorAll('[data-auth-link], [data-login-link], [data-register-link], [data-profile-link]'));
  const logoutButtons = Array.from(document.querySelectorAll('[data-logout-button]'));
  const loginButtons = Array.from(document.querySelectorAll('[data-login-button], [data-login-link]'));
  const registerLinks = Array.from(document.querySelectorAll('[data-register-link], [data-register-button]'));
  const authLabel = document.querySelector('[data-auth-label]');

  const loggedIn = isLoggedIn();
  authLinks.forEach((link) => {
    // For header links: show/hide appropriately, but avoid changing layout attributes
    if (link.hasAttribute('data-login-link') || link.hasAttribute('data-register-link')) {
      // leave href as-is; visibility handled below
    }
    if (loggedIn) {
      // If an auth-link is used as a generic logout trigger, attach logout
      if (link.hasAttribute('data-auth-link')) {
        link.textContent = 'Logout';
        link.setAttribute('href', '#');
        link.addEventListener('click', (event) => {
          event.preventDefault();
          logout();
        });
      }
    } else {
      if (link.hasAttribute('data-auth-link')) {
        link.textContent = 'Login';
        link.setAttribute('href', '/login.html');
      }
    }
  });

  logoutButtons.forEach((button) => {
    button.hidden = !loggedIn;
    if (loggedIn) {
      // ensure logout handler exists (no once:true so it persists if element is re-rendered)
      button.removeEventListener('click', logout);
      button.addEventListener('click', logout);
    }
  });

  loginButtons.forEach((button) => {
    button.hidden = loggedIn;
  });

  registerLinks.forEach((button) => {
    button.hidden = loggedIn;
  });

  if (authLabel) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    authLabel.textContent = loggedIn && currentUser?.name ? `Signed in as ${currentUser.name}` : 'Guest';
  }
}

export {
  apiRequest,
  authHeaders,
  clearAuth,
  getCurrentUser,
  getProfile,
  getToken,
  hydrateAuthState,
  isLoggedIn,
  login,
  logout,
  register,
  redirectIfAuthenticated,
  requireAuth,
  syncLocalCartToDB,
};
