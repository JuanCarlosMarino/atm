//const app = require('express')();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const user = require('./user');
var users = [new user("000243974","123456",50000),new user("000243975","123456",50000),new user("000243976","123456",50000),new user("000243977","123456",50000)];

function getUserData (account,password){
  var index = null;
  for(let i=0;i<users.length;i++){
    if(users[i].account === account && users[i].password === password){
      index = i;
    }
  }
  return index;
}


app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/t_login_input_pin.html');
});

app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/t_account_account_details.html');
});

app.get('/deposit', (req, res) => {
  res.sendFile(__dirname + '/t_account_deposit.html');
});

app.get('/deposit_cash', (req, res) => {
  res.sendFile(__dirname + '/t_account_deposit_cash.html');
});

app.get('/withdrawl', (req, res) => {
  res.sendFile(__dirname + '/t_account_withdrawl.html');
});

io.on('connection', (socket) => {

  socket.on('pin_check', msg => {
    //io.emit('chat message', msg);
    const db = getUserData(msg.account, msg.password);
    socket.join(msg.account);
    if(db!=null){       
      io.sockets.to(msg.account).emit('pin_check', "ok");
    }
    else{
      io.sockets.to(msg.account).emit('pin_check', "error");
    }
    console.log(msg);
    
  });
  socket.on('get_balance', msg => {
    const db = getUserData(msg.account, msg.password);
    socket.join(msg.account);
    if(db!=null){      
      io.sockets.to(msg.account).emit('get_balance', db.balance);
    }
    else{
      io.sockets.to(msg.account).emit('get_balance', "error");
    }
    console.log(msg);
  });

  socket.on('deposit', msg => {
    const db = getUserData(msg.account, msg.password);
    socket.join(msg.account);
    if(db!=null){       
      db.balance += Number(msg.deposit_value);
      io.sockets.to(msg.account).emit('deposit', "ok");
    }
    else{
      io.sockets.to(msg.account).emit('deposit', "error");
    }
    console.log(msg);

  });

  socket.on('withdrawl', msg => {
    console.log(msg);
    const db = getUserData(msg.account, msg.password);
    socket.join(msg.account);
    if(db!=null){ 
      if(db.balance < Number(msg.value)){
        io.sockets.to(msg.account).emit('withdrawl', "error");
      }else{
        db.balance -= Number(msg.value);
        io.sockets.to(msg.account).emit('withdrawl', "ok");
      }
    } 
    else{
      io.sockets.to(msg.account).emit('withdrawl', "error");
    }

  });

});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
