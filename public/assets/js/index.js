const socket = io();
const mainContainer = document.getElementById("main-container");
const connectBtn = document.getElementById("connectBtn");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const messageInput2 = document.getElementById("messageInput2");
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

socket.on("roomChat", (data) => {
  const roomChatContainer = document.getElementById("roomChatContainer");
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

  const roomChat = roomChatContainer.querySelector(".chat-list-2");//line131
  console.log(messageContent)
  roomChat.appendChild(listItem);
  //console.log(listItem)
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

const newRoomBtn = document.getElementById("newRoomBtn");

const createRoomBtn = document.getElementById("createRoomBtn");
const roomNameInput = document.getElementById("roomName");
const roomPasswordInput = document.getElementById("roomPassword");

newRoomBtn.addEventListener("click", () => {
  createRoomModal.show();
});

createRoomBtn.addEventListener("click", () => {
  const roomName = roomNameInput.value.trim();
  const roomPassword = roomPasswordInput.value.trim();

  if (roomName !== "" && roomPassword !== "") {
    // Sunucuya oda oluşturma verilerini gönder
    socket.emit("createRoom", { roomName, roomPassword });
    createRoomModal.hide();
  }
});

socket.on("createRoom", function (roomName) {
  console.log("Çalıştı");
  const roomCard = document.createElement("div");
  roomCard.className = "col-md-4 mb-4";

  const cardContent = document.createElement("div");
  cardContent.className = "card";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body d-flex flex-column align-items-center";

  const roomTitle = document.createElement("h5");
  roomTitle.textContent = roomName;

  const joinButton = document.createElement("button");
  joinButton.textContent = "Giriş Yap";
  joinButton.className = "btn btn-primary mt-2";
  joinButton.setAttribute("data-room", roomName);

  joinButton.addEventListener("click", () => {
    const password = prompt("Oda şifresini girin:");
    if (password !== null && password.trim() !== "") {
      const roomData = {
        roomName: roomName,
        roomPassword: password.trim()
      };
      socket.emit("joinRoom", roomData);
      showRoomChat(roomName); // Chat ekranını yükleme işlevini çağırın
    }
  });

  cardBody.appendChild(roomTitle);
  cardBody.appendChild(joinButton);
  cardContent.appendChild(cardBody);
  roomCard.appendChild(cardContent);

  const roomList = document.getElementById("roomChat");
  roomList.appendChild(roomCard);
});

socket.on("roomChat", (data) => {
  const roomName = data.roomName;
  document.getElementById("roomChat").style.display = "none";
  document.getElementById("chat-card").style.display = "block";
  //document.getElementById("current-room").textContent = roomName;
});





function showRoomChat(roomName) {
  const roomChatContainer = document.getElementById("roomChatContainer");
  roomChatContainer.innerHTML = ""; // Önceki içeriği temizle (opsiyonel)

  // Chat ekranını oluşturma kodunu buraya ekleyin
  // Örneğin:
  const roomChat = document.createElement("ul");
  roomChat.className = "chat-list-2";
  // Gerekli diğer kodları buraya ekleyin

  roomChatContainer.appendChild(roomChat); // Chat ekranını göstermek için container'a ekleyin
  const globalFooter = document.getElementById("global");
  globalFooter.style.display = "none";
  document.getElementById("room").style.display = "block";
}

const roomBtn = document.getElementById("roomBtn");

roomBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const reader = new FileReader();
  const file = fileInput.files[0];

  if (!file && !messageInput2.value) {
    alert("Lütfen bir mesaj girin");
    return;
  }

  const message = messageInput2.value.trim();

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
        socket.emit("roomChat", data); // roomChat eventini emit et
      };
    } else {
      socket.emit("roomChat", data); // roomChat eventini emit et
      console.log(data);
    }

    messageInput2.value = "";
    fileInput.value = "";
  }
});
