class Navbar extends HTMLElement {
  constructor() {
    super();
    this.brand = this.getAttribute("brand") || "SB Bakehouse";
    this.activeIndex = parseInt(this.getAttribute("activeIndex")) || 0;
    this.links = this.parseLinks(this.getAttribute("links") || "");
  }

  static get observedAttributes() {
    return ["brand", "activeIndex", "links"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "brand") {
      this.brand = newValue || "SB Bakehouse";
    } else if (name === "activeIndex") {
      this.activeIndex = parseInt(newValue) || 0;
    } else if (name === "links") {
      this.links = this.parseLinks(newValue || "");
    }
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  parseLinks(linksStr) {
    if (!linksStr) return [];
    try {
      const links = JSON.parse(linksStr.replace(/'/g, '"'));
      return links.map((link, index) => ({
        text: link.text || link.href,
        href: link.href || `pages/${link.text.toLowerCase()}.html`,
        active: index === this.activeIndex,
      }));
    } catch (e) {
      return [];
    }
  }

  render() {
    const linkItems = this.links
      .map(
        (link, index) => `
        <li class="nav-item">
          <a class="nav-link ${link.active ? "active" : ""}" href="${
          link.href
        }">${link.text}</a>
        </li>
      `
      )
      .join("");

    this.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="container">
            <a class="navbar-brand" href="${
              this.links[0]?.href || "../index.html"
            }">${this.brand}</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav ms-auto">
                ${linkItems}
              </ul>
            </div>
          </div>
        </nav>
      `;
  }
}

customElements.define("component-navbar", Navbar);
