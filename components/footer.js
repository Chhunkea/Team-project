class footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <!-- Footer -->
    <footer class="footer">
    <div class="footer-brand">@ SB Bakehouse</div>
    <div class="footer-tagline">Grab your bakery treats now!</div>
    <div class="footer-copyright">
      &copy; 2025 SB Bakehouse. All rights reserved.
    </div>
    </footer>
      `;
  }
}

customElements.define("component-footer", footer);
