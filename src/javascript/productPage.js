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
    Swal.fire({
      title: "Add to cart!",
      icon: "success",
      draggable: true
    });
  }
});

// Load navbar and render products on page load
window.onload = () => {
  renderProducts("../data/product.json");
};