const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const db = require('./user');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    //io.emit('chat message', msg);
    console.log(msg);
    
  });
  socket.on('withdraw', msg => {
    io.emit('chat message', msg);
  });
  socket.on('check', msg => {
    io.emit('chat message', msg);
  });
  socket.on('consign', msg => {
    io.emit('chat message', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
