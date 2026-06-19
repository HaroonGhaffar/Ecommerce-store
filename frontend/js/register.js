import './components/header.js';
import './components/footer.js';
import { hydrateAuthState, isLoggedIn, redirectIfAuthenticated, register } from './auth.js';

const form = document.getElementById('register-form');
const message = document.getElementById('register-message');

redirectIfAuthenticated('index.html');
hydrateAuthState();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = '';

  try {
    await register(form.name.value.trim(), form.email.value.trim(), form.password.value);
    window.location.href = '/index.html';
  } catch (error) {
    message.textContent = error.message;
  }
});

if (isLoggedIn()) {
  message.textContent = 'You are already signed in.';
}
