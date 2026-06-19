const FOOTER_HTML = `
  <footer class="site-footer">
    <div class="container site-footer__inner">
      <div class="site-footer__section">
        <h3>About MyStore</h3>
        <p>Your one-stop shop for quality products at great prices. We're committed to excellent customer service and fast shipping.</p>
      </div>

      <div class="site-footer__section">
        <h3>Quick Links</h3>
        <ul class="site-footer__links">
          <li><a href="/index.html">Home</a></li>
          <li><a href="/cart.html">Cart</a></li>
          <li><a href="/profile.html">Profile</a></li>
        </ul>
      </div>

      <div class="site-footer__section">
        <h3>Contact Info</h3>
        <ul class="site-footer__contact">
          <li>Email: support@mystore.com</li>
          <li>Phone: 1-800-MYSTORE</li>
          <li>Hours: 24/7 Customer Support</li>
        </ul>
      </div>

      <div class="site-footer__section">
        <h3>Follow Us</h3>
        <ul class="site-footer__social">
          <li><a href="#" aria-label="Facebook">Facebook</a></li>
          <li><a href="#" aria-label="Twitter">Twitter</a></li>
          <li><a href="#" aria-label="Instagram">Instagram</a></li>
        </ul>
      </div>
    </div>

    <div class="site-footer__bottom">
      <div class="container">
        <p>&copy; 2026 MyStore. All rights reserved.</p>
      </div>
    </div>
  </footer>
`;

function mountFooter() {
  const mountPoint = document.getElementById('site-footer');
  if (!mountPoint || mountPoint.dataset.footerMounted === 'true') return;

  mountPoint.innerHTML = FOOTER_HTML;
  mountPoint.dataset.footerMounted = 'true';
}

mountFooter();
export { mountFooter };
