const socket = io();
const mainContainer = document.getElementById("main-container");
const connectBtn = document.getElementById("connectBtn");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");

const emojiBtn = document.getElementById("emojiBtn");
const emojiPanel = document.getElementById("emojiPanel");
const emojiContainer = document.querySelector(".emoji-container");

const fileInput = document.getElementById("fileInput");

let globalUserName;

connectBtn.addEventListener("click", () => {
  const usernameInput = document.getElementById("username");
  globalUserName = usernameInput.value;
  const username = usernameInput.value;
  if (username.trim() !== "") {
    socket.emit("join", username);

    mainContainer.removeChild(document.getElementById("user-login-block"));
    document.getElementById("online-users").style.display = "block";
    document.getElementById("chat-card").style.display = "block";
  }
});

socket.on("userList", (userList) => {
  const userListElement = document.getElementById("userList");
  userListElement.innerHTML = "";

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
      hour12: true,
    });
    timeInfo.textContent = formattedTime;
  
    messageContent.appendChild(senderInfo);
  
    if (data.file) {
      const fileImage = document.createElement("img");
      fileImage.src = data.file.content;
      fileImage.alt = data.file.name;
      fileImage.style.maxWidth = "100%";
      fileImage.style.maxHeight = "200px";
      messageContent.appendChild(fileImage);
    }
      
      messageContent.appendChild(messageText);
      messageContent.appendChild(timeInfo);
      listItem.appendChild(messageContent);
      
      globalChat.appendChild(listItem);
      
  });
  
sendBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const reader = new FileReader();
  const file = fileInput.files[0];

  if (!file && !messageInput.value) {
    alert("Lütfen bir mesaj girin");
    return;
  }

  const message = messageInput.value.trim();

  if (message !== "" || file) {
    const timeInfo = document.createElement("span");
    timeInfo.classList.add("time-info");
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    timeInfo.textContent = formattedTime;

    const data = { sender: globalUserName, message };

    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        data.file = {
          name: file.name,
          type: file.type,
          size: file.size,
          content: reader.result,
        };
        socket.emit("chat message", data);
      };
    } else {
      socket.emit("chat message", data);
    }

    messageInput.value = "";
    fileInput.value = "";
  }
});

const emoji = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "😗", "😙", "😚"];

emojiBtn.addEventListener("click", () => {
  emojiPanel.classList.toggle("d-none");
});

emoji.forEach((e) => {
  const emojiButton = document.createElement("button");
  emojiButton.classList.add("emoji-button");
  emojiButton.textContent = e;
  emojiButton.addEventListener("click", () => {
    const currentMessage = messageInput.value;
    messageInput.value = currentMessage + e;
    emojiPanel.classList.add("d-none");
  });
  emojiContainer.appendChild(emojiButton);
});

