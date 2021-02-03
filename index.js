const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const user = require('./user');
const client = new user();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/jorge_login.html');
});

app.get('/account', (req, res) => {
  res.sendFile(__dirname + '/jorge_bank.html');
});
 
io.on('connection', (socket) => {
  socket.on('look', msg => {
    if(msg.account === client.account && msg.password === client.password){
      io.emit('look',"ok");
    }else{
      io.emit('look',"error");
    }
    console.log(msg)    
  });
  
  socket.on('withdrawValue', msg => {
    console.log(msg);
    if(client.balance > Number(msg)){  
      client.balance -= Number(msg);
      io.emit('withdrawValue', "ok");
    }else{                
      io.emit('withdrawValue', "error");
    }
  });
  socket.on('updateBalance', msg => {
    io.emit('updateBalance', client.balance);
    console.log(msg);
  });
  socket.on('consignValue', msg => {
    console.log(msg);
    client.balance += Number(msg);
    io.emit('consignValue', "ok")
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
