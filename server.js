const http = require('http');
const express = require('express');
const socket = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const socketio = socket(server);
const port = 3000;

// İndex HTML'i başlat
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const onlineUsers = new Map(); // çevrimiçi kullanıcı listesi

socketio.on('connection', (socket) => {
  socket.on('join', (username) => {
    onlineUsers.set(socket.id, username); // yeni kullanıcıyı listeye ekle
    console.log(username + ' sunucuya bağlandı..!')
    socketio.emit('userList', Array.from(onlineUsers.values()));
  });

  // İstemci bağlantısı kesildiğinde listeyi güncelle ve kullanıcıyı sil
  socket.on('disconnect', () => {
    const username = onlineUsers.get(socket.id); // soket kimliğini kullanarak kullanıcı adını al
    onlineUsers.delete(socket.id); // kullanıcıyı listeden sil
    console.log(username + ' sunucudan ayrıldı..!')
    socketio.emit('userList', Array.from(onlineUsers.values()));
  });

  socket.on('chat message', (msg) => {
    const { sender, message, file } = msg;

    const data = {
      sender: sender,
      message: message,
      file: file ? { name: file.name, type: file.type, content: file.content } : null
    };

    socketio.emit('chat message', data);

    // Mesajı kullanmak için istediğiniz işlemleri burada yapabilirsiniz
  });

});

// Port dinle
server.listen(port, () => {
  console.log("Her şey yolunda..!")
});
