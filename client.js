// Client Side

const socket = io.connect("http://localhost:8000");

const form = document.getElementById("send-container");
const messageInput = document.getElementById("msgInp");
const messageContainer = document.querySelector(".container");
const disconnectBtn = document.getElementById("disconnect-btn");
const audio = new Audio("./components/assets/tone1.wav");

const name = prompt("Enter your name to join");
if (name) {
  socket.emit("new-user-joined", name);
}

const appendMessage = (message, position) => {
  const messageContent = document.createElement("div");
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContent.classList.add(position);
  messageElement.classList.add("message");
  messageContent.append(messageElement);
  messageContainer.append(messageContent);
  messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll to the latest message
  if (position === "left") {
    audio.play();
  }
};

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    appendMessage(`You: ${message}`, "right");
    socket.emit("send", message);
    messageInput.value = "";
  }
});

// Handle manual disconnect
disconnectBtn.addEventListener("click", () => {
  socket.disconnect();
  appendMessage(`You have disconnected from the chat`, "middle");
});

// Listen for user-joined event
socket.on("user-joined", (name) => {
  appendMessage(`${name} joined the chat`, "middle");
});

// Listen for receive event
socket.on("receive", (data) => {
  appendMessage(`${data.name}: ${data.message}`, "left");
});

// Listen for user-left event
socket.on("left", (name) => {
  if (name) {
    // Only show the "left" message if the name is not null
    appendMessage(`${name} left the chat`, "middle");
  }
});
