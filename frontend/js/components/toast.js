const TOAST_STYLE_ID = 'toast-styles';
const TOAST_CONTAINER_ID = 'toast-container';

function ensureToastStyles() {
  if (document.getElementById(TOAST_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = TOAST_STYLE_ID;
  style.textContent = `
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      pointer-events: none;
    }

    .toast {
      min-width: 220px;
      max-width: min(92vw, 360px);
      padding: 0.9rem 1rem;
      border-radius: 12px;
      color: #fff;
      background: rgba(17, 24, 39, 0.96);
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.2);
      font-size: 0.95rem;
      line-height: 1.4;
      transform: translateY(-8px);
      opacity: 0;
      animation: toast-in 0.2s ease-out forwards;
    }

    .toast--success {
      background: rgba(22, 101, 52, 0.96);
    }

    .toast--error {
      background: rgba(153, 27, 27, 0.96);
    }

    @keyframes toast-in {
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes toast-out {
      to {
        transform: translateY(-8px);
        opacity: 0;
      }
    }

    @media (max-width: 480px) {
      .toast-container {
        left: 1rem;
        right: 1rem;
      }

      .toast {
        width: 100%;
      }
    }
  `;

  document.head.appendChild(style);
}

function ensureToastContainer() {
  let container = document.getElementById(TOAST_CONTAINER_ID);
  if (container) return container;

  container = document.createElement('div');
  container.id = TOAST_CONTAINER_ID;
  container.className = 'toast-container';
  container.setAttribute('aria-live', 'polite');
  container.setAttribute('aria-atomic', 'true');
  document.body.appendChild(container);
  return container;
}

function showToast(message, type = 'success') {
  if (!message) return;

  ensureToastStyles();
  const container = ensureToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  window.setTimeout(() => {
    toast.style.animation = 'toast-out 0.2s ease-in forwards';
    window.setTimeout(() => {
      toast.remove();
      if (!container.children.length) {
        container.remove();
      }
    }, 200);
  }, 2000);
}

export { showToast };