document.addEventListener("DOMContentLoaded", () => {
  // Cart storage using localStorage
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    if (!cartContainer || !cartTotal) {
      console.error("Required elements not found");
      return;
    }

    cartContainer.innerHTML = "";
    let total = 0;

    cartItems.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      cartContainer.innerHTML += `
        <div class="cart-item card mb-4">
          <div class="card-body d-flex align-items-center justify-content-between">
            <div class="item-image">
              <img src="${item.image || ''}" alt="${item.name || 'Item'}" class="cart-image">
            </div>
            <div class="item-details">
              <h5 class="card-title">${item.name || 'Unnamed Item'}</h5>
              <p class="card-text">Price: $${(item.price || 0).toFixed(2)}</p>
            </div>
            <div class="quantity-control">
              <button class="btn btn-quantity btn-minus" data-index="${index}" data-change="-1">-</button>
              <span class="quantity-value">${item.quantity || 0}</span>
              <button class="btn btn-quantity btn-plus" data-index="${index}" data-change="1">+</button>
            </div>
          </div>
        </div>
      `;
    });

    cartTotal.textContent = total.toFixed(2);
    localStorage.setItem("cart", JSON.stringify(cartItems));

    if (cartItems.length === 0) {
      cartContainer.innerHTML = "<div class='text-center empty-cart'>Your cart is empty</div>";
    }
  }

  function updateQuantity(index, change) {
    if (!cartItems[index]) {
      console.error("Invalid item index:", index);
      return;
    }
    cartItems[index].quantity += change;
    if (cartItems[index].quantity <= 0) {
      cartItems.splice(index, 1);
    } else if (cartItems[index].quantity > 99) {
      cartItems[index].quantity = 99;
    }
    renderCart();
  }

  // Event delegation for quantity buttons
  document.getElementById("cart-items").addEventListener("click", (e) => {
    const button = e.target.closest(".btn-quantity");
    if (!button) return;

    const index = parseInt(button.getAttribute("data-index"));
    const change = parseInt(button.getAttribute("data-change"));
    updateQuantity(index, change);
  });

  window.addEventListener("storage", (event) => {
    if (event.key === "cart") {
      cartItems = JSON.parse(event.newValue) || [];
      renderCart();
    }
  });

  renderCart();

  const checkoutButton = document.querySelector(".btn-primary");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Proceeding to checkout!");
    });
  } else {
    console.error("Checkout button not found");
  }
});