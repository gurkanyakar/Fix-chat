// const http = require('http');

// const server = http.createServer((req,res) => {
//     res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8'});
//     res.write('Successfull connection ! ');
//     res.end();
// });

// server.listen(3000, () => {
//     console.log('App started !')
// })


const express = require('express');

const app = express();

app.get('/', (req,res) => {
    res.send('test message ... !');
})

app.get('/chat', (req, res) => {
    res.send('you are in chat page...!');
   });

app.listen(3000, ()=> {
    console.log("everything is ok..!")
}) 