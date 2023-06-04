const socket = io();
const mainContainer = document.getElementById("main-container");
const connectBtn = document.getElementById("connectBtn");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
let globalUserName;

connectBtn.addEventListener("click", () => {
  const usernameInput = document.getElementById("username");
  globalUserName = usernameInput.value;
  const username = usernameInput.value;
  if (username.trim() !== "") {
    socket.emit("join", username);

    mainContainer.removeChild(
      document.getElementById("user-login-block")
    );
    document.getElementById("online-users").style.display = "block";
    document.getElementById("chat-card").style.display = "block";
  }
});

socket.on("userList", (userList) => {
  const userListElement = document.getElementById("userList");
  userListElement.innerHTML = ""; // Önceki kullanıcı listesini temizle

  userList.forEach((username) => {
    const listItem = document.createElement("li");
    listItem.textContent = username;
    listItem.classList.add("list-group-item");

    if (username === globalUserName) {
      listItem.classList.add("current-user");
    }

    userListElement.appendChild(listItem);
  });
});

socket.on("chat message", (data) => {
const globalChat = document.getElementById("globalChat");
const listItem = document.createElement("li");
listItem.classList.add("chat-item");

const messageContent = document.createElement("div");
messageContent.classList.add("message-content");

const senderInfo = document.createElement("span");
senderInfo.classList.add("sender-info");
senderInfo.textContent = data.sender + ": ";

const messageText = document.createElement("span");
messageText.classList.add("message-text");
messageText.textContent = data.message;

const timeInfo = document.createElement("span");
timeInfo.classList.add("time-info");
const currentTime = new Date();
const formattedTime = currentTime.toLocaleTimeString("en-US", {
hour: "numeric",
minute: "numeric",
hour12: true
});
timeInfo.textContent = formattedTime;

messageContent.appendChild(senderInfo);
messageContent.appendChild(messageText);
messageContent.appendChild(timeInfo);
listItem.appendChild(messageContent);
globalChat.appendChild(listItem);
});

sendBtn.addEventListener("click", () => {
  const message = messageInput.value;
  if (message.trim() !== "") {
    const isGlobal = true;

    const timeInfo = document.createElement("span");
    timeInfo.classList.add("time-info");
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    timeInfo.textContent = formattedTime;

    socket.emit("chat message", { sender: globalUserName, message }); // Gönderenin kullanıcı adını iletiyoruz
    messageInput.value = "";
  }
});


