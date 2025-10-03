// Function to load navbar component
function loadNavbar() {
  fetch("components/navbar.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("navbar-container").innerHTML = html;
    })
    .catch((error) => console.error("Error loading navbar:", error));
}

// Function to fetch and render products
async function renderProducts(productPath = "../data/product.json") {
  const container = document.getElementById("product-container");
  if (!container) {
    console.error("Product container not found");
    return;
  }

  console.log("Fetching products from:", productPath); // Debug log
  try {
    const response = await fetch(productPath);
    if (!response.ok)
      throw new Error(
        `Products fetch failed: ${response.status} ${response.statusText}`
      );
    const products = await response.json();

    container.innerHTML = ""; // Clear existing content
    products.forEach((product) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";
      // Adjust image path based on context
      const imagePath = product.image.startsWith("/")
        ? product.image
        : "/" + product.image;
      col.innerHTML = `
        <div class="card product-card">
          <img src="${imagePath}" class="card-img-top" alt="${product.name}" />
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">$${product.price.toFixed(2)}</p>
            <a href="#" class="btn btn-primary add-to-cart" data-name="${
              product.name
            }" data-price="${
        product.price
      }" data-image="${imagePath}">Add to Cart</a>
          </div>
        </div>
      `;
      container.appendChild(col);
    });
  } catch (error) {
    console.error("Error rendering products:", error);
    container.innerHTML =
      "<p>Failed to load products. Please try again later.</p>";
  }
}

// Add to Cart functionality with localStorage
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    e.preventDefault();
    const name = e.target.getAttribute("data-name");
    const price = parseFloat(e.target.getAttribute("data-price"));
    const image = e.target.getAttribute("data-image");

    if (!name || isNaN(price) || !image) {
      console.error("Invalid cart item data:", { name, price, image });
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Item added to cart!");
  }
});

// Load navbar and render products on page load
window.onload = () => {
  loadNavbar();
  renderProducts(); // Uses default path
};
