//const app = require('express')();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const user = require('./user');
const db = new user();

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
    if(msg.account === db.account && msg.password === db.password){
      io.emit('pin_check', "ok");
    }
    else{
      io.emit('pin_check', "error");
    }
    console.log(msg);
    
  });
  socket.on('get_balance', msg => {
    io.emit('get_balance', db.balance);
    console.log(msg);
  });

  socket.on('deposit', msg => {
    console.log(msg);
    db.balance += Number(msg);
  });

  socket.on('withdrawl', msg => {
    console.log(msg);
    if(db.balance < Number(msg)){
      io.emit('withdrawl', "error");
    }else{
      db.balance -= Number(msg);
      io.emit('withdrawl', "ok");
    }
    
  });

});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
