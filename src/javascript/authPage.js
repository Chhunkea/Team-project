// Load users from users.json or localStorage
let users = [];

async function loadUsers() {
  try {
    // Try to load from localStorage first
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      users = JSON.parse(storedUsers);
      return;
    }
    // Fallback to users.json if localStorage is empty
    const response = await fetch("users.json");
    if (!response.ok) {
      throw new Error("Failed to load user data");
    }
    users = await response.json();
    localStorage.setItem("users", JSON.stringify(users)); // Save to localStorage
  } catch (error) {
    console.error("Error loading users:", error);
    showModal("Error", "Failed to load user data. Please try again later.");
  }
}

// Save users to localStorage
function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function toggleForm() {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  loginForm.classList.toggle("hidden");
  registerForm.classList.toggle("hidden");
  clearErrors();
}

function clearErrors() {
  document.getElementById("login-error").classList.add("hidden");
  document.getElementById("register-error").classList.add("hidden");
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
}

function showModal(title, message) {
  const modal = document.getElementById("alert-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalMessage = document.getElementById("modal-message");
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modal.classList.remove("hidden");
}

function closeModal() {
  const modal = document.getElementById("alert-modal");
  modal.classList.add("hidden");
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function handleLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    showError("login-error", "Please fill in all fields");
    showModal("Login Error", "Please fill in all fields");
    return;
  }

  if (!validateEmail(email)) {
    showError("login-error", "Invalid email format");
    showModal("Login Error", "Invalid email format");
    return;
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    showError("login-error", "No account found with this email");
    showModal(
      "Login Failed",
      "No account found with this email. Please register."
    );
    return;
  }

  if (user.password !== password) {
    showError("login-error", "Invalid email or password");
    showModal("Login Failed", "Incorrect password. Please try again.");
    return;
  }

  // Redirect to homepage with username as query parameter
  window.location.href = `homepage.html?username=${encodeURIComponent(
    user.username
  )}`;
  clearErrors();
}

async function handleRegister() {
  const username = document.getElementById("register-username").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  if (!username || !email || !password) {
    showError("register-error", "Please fill in all fields");
    showModal("Registration Error", "Please fill in all fields");
    return;
  }

  if (!validateEmail(email)) {
    showError("register-error", "Invalid email format");
    showModal("Registration Error", "Invalid email format");
    return;
  }

  if (users.some((u) => u.email === email)) {
    showError("register-error", "Email already registered");
    showModal("Registration Error", "Email already registered");
    return;
  }

  if (password.length < 6) {
    showError("register-error", "Password must be at least 6 characters");
    showModal(
      "Password Too Short",
      "Your password must be at least 6 characters long"
    );
    return;
  }

  const newUser = { username, email, password };
  users.push(newUser);
  saveUsers(); // Save to localStorage
  alert("Registration successful! Please login.");
  toggleForm();
  clearErrors();
}

// Attach event listeners after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  document
    .querySelector("#login-form button")
    .addEventListener("click", handleLogin);
  document
    .querySelectorAll("#login-form a, #register-form a")
    .forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        toggleForm();
      });
    });
  document
    .querySelector("#register-form button")
    .addEventListener("click", handleRegister);
  document
    .querySelector("#alert-modal button")
    .addEventListener("click", closeModal);
});
