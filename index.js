const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const user = require('./user');
const clients = [new user("000361341", "1234", 15000), new user("000361342", "1234", 12500),
 new user("000361343", "1234", 10000), new user("000361344", "1234", 19500)];

function clientsAccount(account, password) {
  var client_account = null;
  for (let i = 0; i < clients.length; i++) {
    if (clients[i].account === account && clients[i].password === password) {
      client_account = i;
    }
  }
  return client_account;
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/jorge_bank.html');
});

io.on('connection', (socket) => {
  socket.on('withdrawValue', msg => {
    const value = clientsAccount(msg.account,msg.password);
    console.log(msg);
    socket.join(msg.account);
    if (value != null) {
      if (clients[value].balance > Number(msg.withdrawValue)) {
        clients[value].balance = clients[value].balance- Number(msg.withdrawValue);
        io.sockets.to(msg.account).emit('withdrawValue', "ok");
      }
    } else {
      io.sockets.to(msg.account).emit('withdrawValue', "error");
    }
  });

  socket.on('updateBalance', msg => {
    const value = clientsAccount(msg.account,msg.password);
    socket.join(msg.account);    
    if (value !=null) {
      io.sockets.to(msg.account).emit ('updateBalance',clients[value].balance)
    }else{
      io.sockets.to(msg.account).emit('updateBalance', "error");
    }
    console.log(msg);    
  });

  socket.on('consignValue', msg => {
    const value = clientsAccount(msg.account,msg.password);    
    socket.join(msg.account);   
    if(value != null){      
      clients[value].balance +=  Number(msg.consignValue);      
      io.sockets.to(msg.account).emit('consignValue', "ok");
    }else {
      io.sockets.to(msg.account).emit('consignValue',"error");
    }
    console.log(msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
