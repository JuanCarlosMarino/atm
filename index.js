const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const user = require('./user');
const db = new user();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('auth', msg => {
    if(msg.password === db.password && msg.account === db.account){
      io.emit('auth',"ok");
    }else{
      io.emit('auth',"error");
    }
    console.log(msg)    
  });

  socket.on('withdraw', msg => {
    console.log(msg);
    if(db.balance > Number(msg)){  
      db.balance -= Number(msg);
      io.emit('withdraw', "ok");
    }else{                
      io.emit('withdraw', "error");
    }
  });

  socket.on('check', msg => {
    io.emit('check', db.balance);
    console.log(msg);
  });

  socket.on('consign', msg => {
    console.log(msg);
    db.balance += Number(msg);
    io.emit('consign', "ok")
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
