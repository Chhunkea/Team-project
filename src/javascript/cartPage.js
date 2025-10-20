// Wait until the HTML document is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  // Retrieve cart items from localStorage (if any), otherwise use an empty array
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  // Function to render the cart items and total price in the DOM
  function renderCart() {
    const cartContainer = document.getElementById("cart-items"); // Element to display cart items
    const cartTotal = document.getElementById("cart-total"); // Element to show total price

    // Check if required elements exist before continuing
    if (!cartContainer || !cartTotal) {
      console.error("Required elements not found");
      return;
    }

    // Clear the cart container before re-rendering
    cartContainer.innerHTML = "";
    let total = 0; // Track total cost

    // Loop through each cart item and create HTML elements for it
    cartItems.forEach((item, index) => {
      const itemTotal = item.price * item.quantity; // Calculate each item’s total price
      total += itemTotal; // Add to total

      // Create the HTML structure for each item
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
              <!-- Quantity buttons and display -->
              <button class="btn btn-quantity btn-minus" data-index="${index}" data-change="-1">-</button>
              <span class="quantity-value">${item.quantity || 0}</span>
              <button class="btn btn-quantity btn-plus" data-index="${index}" data-change="1">+</button>
            </div>
          </div>
        </div>
      `;
    });

    // Update total price in the DOM
    cartTotal.textContent = total.toFixed(2);

    // Save updated cart data back to localStorage
    localStorage.setItem("cart", JSON.stringify(cartItems));

    // If cart is empty, display an empty message
    if (cartItems.length === 0) {
      cartContainer.innerHTML = "<div class='text-center empty-cart'>Your cart is empty</div>";
    }
  }

  // Function to handle quantity updates (+ or -)
  function updateQuantity(index, change) {
    // Validate that the item index exists
    if (!cartItems[index]) {
      console.error("Invalid item index:", index);
      return;
    }

    // Update quantity based on button click (+1 or -1)
    cartItems[index].quantity += change;

    // If quantity is 0 or less, remove the item
    if (cartItems[index].quantity <= 0) {
      cartItems.splice(index, 1);
    }
    // Limit maximum quantity to 99
    else if (cartItems[index].quantity > 99) {
      cartItems[index].quantity = 99;
    }

    // Re-render the cart after updating quantities
    renderCart();
  }

  // Use event delegation to listen for all clicks on quantity buttons inside the cart
  document.getElementById("cart-items").addEventListener("click", (e) => {
    const button = e.target.closest(".btn-quantity"); // Find the clicked button
    if (!button) return; // If click wasn’t on a button, ignore

    // Get item index and change value from button attributes
    const index = parseInt(button.getAttribute("data-index"));
    const change = parseInt(button.getAttribute("data-change"));

    // Update the quantity of the selected item
    updateQuantity(index, change);
  });

  // Listen for storage changes (sync cart updates between multiple tabs)
  window.addEventListener("storage", (event) => {
    if (event.key === "cart") {
      // Update local cart and re-render if cart data changes in another tab
      cartItems = JSON.parse(event.newValue) || [];
      renderCart();
    }
  });

  // Initial render of the cart when the page loads
  renderCart();

  // Handle checkout button click
  const checkoutButton = document.querySelector(".btn-primary");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent page reload or form submission
      alert("Proceeding to checkout!"); // Simple alert (placeholder for real checkout)
    });
  } else {
    console.error("Checkout button not found");
  }
});
