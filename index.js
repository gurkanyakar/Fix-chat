const http = require('http');
const express = require('express');
const socket = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const socketio = socket(server);
const port = 3000;

//start index html
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const onlineUsers = new Map(); //online user list

socketio.on('connection', (socket) => {
    socket.on('join', (username) => {
        onlineUsers.set(socket.id, username); // add new user to list
        console.log(username + ' connected to server..!')
        socketio.emit('userList', Array.from(onlineUsers.values()));
    });
    //client disconnect delete from list
    socket.on('disconnect', () => {
        const username = onlineUsers.get(socket.id); // get username using socket id
        onlineUsers.delete(socket.id); //delete user to list
        console.log(username + ' disconnected to server..!')
        socketio.emit('userList', Array.from(onlineUsers.values()));
    });
  });


//listen port
server.listen(port, ()=> {
    console.log("everything is ok..!")
}) 