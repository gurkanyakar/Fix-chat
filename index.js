const http = require('http');

const server = http.createServer((req,res) => {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8'});
    res.write('Successfull connection ! ');
    res.end();
});

server.listen(3000, () => {
    console.log('App started !')
})