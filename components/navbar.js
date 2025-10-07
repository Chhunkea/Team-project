class Navbar extends HTMLElement {
  constructor() {
    super();
    this.brand = this.getAttribute("brand") || "SB Bakehouse";
    this.activeIndex = parseInt(this.getAttribute("activeIndex")) || 0;
    this.links = this.parseLinks(this.getAttribute("links") || "");
    console.log(
      "Constructor - brand:",
      this.brand,
      "activeIndex:",
      this.activeIndex,
      "links:",
      this.links
    );
  }

  static get observedAttributes() {
    return ["brand", "activeIndex", "links"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("Attribute changed:", name, "newValue:", newValue);
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
    console.log("Connected to DOM");
    // Dynamically determine activeIndex based on the current page URL
    const currentPath = window.location.pathname;
    console.log("Current pathname:", currentPath);
    this.links.forEach((link, index) => {
      const normalizedHref = link.href.replace(/^\.\.\//, "");
      if (currentPath.endsWith(normalizedHref)) {
        this.activeIndex = index;
        console.log(`Matched ${link.text} at index ${index} with ${currentPath}`);
      }
    });
    this.render();
    // Update cart count on initial load
    this.updateCartCount();
    // Listen for storage changes (e.g., from other pages)
    window.addEventListener("storage", () => this.updateCartCount());
    // Inject styles into the document head
    if (!document.getElementById("navbar-styles")) {
      const style = document.createElement("style");
      style.id = "navbar-styles";
      style.textContent = `
        .navbar {
          background-color: #6b4e31;
          padding: 1rem 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
        }
        .navbar-brand {
          font-weight: 700;
          font-size: 1.8rem;
          color: #fff;
          transition: color 0.3s ease;
        }
        .navbar-brand:hover {
          color: #f8e1d4;
        }
        .nav-link {
          color: #fff !important;
          font-size: 1.1rem;
          margin-left: 1rem;
          transition: color 0.3s ease;
          position: relative;
        }
        .nav-link:hover,
        .nav-link.active {
          color: #f8e1d4 !important;
          font-weight: 500;
        }
        .navbar-toggler {
          border: none;
        }
        .navbar-collapse {
          padding-top: 10px;
        }
        .cart-badge {
          position: absolute;
          top: -5px;
          right: -10px;
          background-color: #dc3545;
          color: #fff;
          border-radius: 50%;
          padding: 2px 6px;
          font-size: 0.8rem;
          min-width: 1rem;
          text-align: center;
        }
        @media (max-width: 767px) {
          .navbar {
            padding: 0.8rem;
            padding-bottom: 0.8rem; /* Adjusted for mobile */
          }
          .navbar-nav {
            text-align: left;
            padding: 10px 0;
          }
          .nav-link {
            margin: 0.5rem 0;
            font-size: 1rem;
          }
          .cart-badge {
            top: -2px;
            right: -5px;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  parseLinks(linksStr) {
    console.log("Parsing links:", linksStr);
    if (!linksStr) return [];
    try {
      const links = JSON.parse(linksStr.replace(/'/g, '"'));
      const parsedLinks = links.map((link, index) => ({
        text: link.text || link.href,
        href: link.href || `pages/${link.text.toLowerCase()}.html`,
        active: index === this.activeIndex,
      }));
      console.log("Parsed links:", parsedLinks);
      return parsedLinks;
    } catch (e) {
      console.error("Error parsing links:", e, "Input:", linksStr);
      return [];
    }
  }

  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartLink = this.querySelector(`a[href="${this.links.find(link => link.text === "Cart")?.href}"]`);
    if (cartLink) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      const badge = cartLink.querySelector(".cart-badge");
      if (totalItems > 0) {
        if (!badge) {
          const newBadge = document.createElement("span");
          newBadge.className = "cart-badge";
          newBadge.textContent = totalItems;
          cartLink.appendChild(newBadge);
        } else {
          badge.textContent = totalItems;
        }
      } else if (badge) {
        badge.remove();
      }
    }
  }

  render() {
    console.log(
      "Rendering Navbar with activeIndex:",
      this.activeIndex,
      "Links:",
      this.links
    );
    const linkItems = this.links
      .map(
        (link, index) => `
        <li class="nav-item">
          <a class="nav-link ${link.active ? "active" : ""}" href="${
          link.href
        }">${link.text}${
          link.text === "Cart" ? '<span class="cart-badge"></span>' : ""
        }</a>
        </li>
      `
      )
      .join("");

    this.innerHTML = `
      <nav class="navbar navbar-expand-lg">
        <div class="container">
          <a class="navbar-brand" href="${
            this.links[0]?.href || "./index.html"
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
    this.updateCartCount(); // Update cart count after rendering
  }
}

customElements.define("component-navbar", Navbar);