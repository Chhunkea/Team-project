// Function to load navbar component
function loadNavbar() {
  fetch("./navbar.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("navbar-container").innerHTML = html;
    })
    .catch((error) => console.error("Error loading navbar:", error));
}

// Product data array
const products = [
  {
    name: "Green Tea Powder",
    price: 29.99,
    image: "asset/homepage/product-1.jpg",
  },
  { name: "Cupcake Tray", price: 49.99, image: "asset/homepage/product-2.jpg" },
  { name: "Matcha Tin", price: 19.99, image: "asset/homepage/product-3.jpg" },
  {
    name: "Fruit Cake Set",
    price: 19.99,
    image: "asset/homepage/product-4.jpg",
  },
  { name: "Pastry Box", price: 19.99, image: "asset/homepage/product-5.jpg" },
  { name: "Cookie Jar", price: 19.99, image: "asset/homepage/product-6.jpg" },
  { name: "Brownie Set", price: 19.99, image: "asset/homepage/product-7.jpg" },
  {
    name: "Dessert Platter",
    price: 19.99,
    image: "asset/homepage/product-8.jpg",
  },
];

// Function to generate product cards
function renderProducts() {
  const container = document.getElementById("product-container");
  products.forEach((product) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="card product-card">
        <img src="${product.image}" class="card-img-top" alt="${
      product.name
    }" />
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">$${product.price.toFixed(2)}</p>
          <a href="#" class="btn btn-primary add-to-cart" data-name="${
            product.name
          }" data-price="${product.price}" data-image="${
      product.image
    }">Add to Cart</a>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// Add to Cart functionality with localStorage
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    e.preventDefault();
    const name = e.target.getAttribute("data-name");
    const price = parseFloat(e.target.getAttribute("data-price"));
    const image = e.target.getAttribute("data-image");

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
  renderProducts();
};
