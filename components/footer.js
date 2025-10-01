class footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>&copy; Established 2025 SB Bakehouse.</p>
      </div>
    </footer>
      `;
  }
}

customElements.define("component-footer", footer);
