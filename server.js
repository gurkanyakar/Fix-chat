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

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename; // İstekten dosya adını al

  const filePath = path.join(__dirname, 'dosya-klasoru', filename); // Dosya yolu oluştur

  res.download(filePath, (err) => {
    if (err) {
      console.error('Dosya indirme hatası:', err);
      res.status(500).send('Dosya indirme hatası'); // Hata durumunda uygun bir yanıt gönder
    }
  });
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

  socket.on('chat message', (data) => {
    const { sender, message, file } = data;
  
    const messageData = {
      sender: sender,
      message: message,
      file: null
    };
  
    if (file && file.type.indexOf("image/") === 0) {
      messageData.file = {
        content: file.content,
        name: file.name
      };
    }
  
    socketio.emit('chat message', messageData);
  });

});

// Port dinle
server.listen(port, () => {
  console.log("Her şey yolunda..!")
});
