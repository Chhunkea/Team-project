let clickCount = 0;

function showLoveMessage() {
  const messageDiv = document.getElementById("celebration-message");

  // Trigger confetti only on the first click
  if (clickCount === 0) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff69b4", "#ffdde1", "#fff0f5", "#ff1493"],
    });
  }

  // Update message based on click count
  if (clickCount === 0) {
    messageDiv.textContent =
      "Yay! You’re part of our Bakehouse family now! 💖 Visit us soon for a treat!";
  } else {
    messageDiv.textContent = "You're now part of our family! 😡";
  }

  // Show the message
  messageDiv.classList.add("show");

  // Hide message after 3 seconds
  setTimeout(() => {
    messageDiv.classList.remove("show");
    // Reset click count after message hides if it's the second click
    if (clickCount > 0) clickCount = 0;
  }, 3000);

  // Increment click count
  clickCount++;
}
