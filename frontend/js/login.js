import './components/header.js';
import './components/footer.js';
import { hydrateAuthState, isLoggedIn, login, redirectIfAuthenticated } from './auth.js';

const form = document.getElementById('login-form');
const message = document.getElementById('login-message');

redirectIfAuthenticated('index.html');
hydrateAuthState();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = '';

  try {
    await login(form.email.value.trim(), form.password.value);
    const next = new URLSearchParams(window.location.search).get('next');
    window.location.href = next ? `/${next}` : '/index.html';
  } catch (error) {
    message.textContent = error.message;
  }
});

if (isLoggedIn()) {
  message.textContent = 'You are already signed in.';
}
