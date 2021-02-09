const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const user = require('./user');
var users = [new user("000362377","123456",50000),new user("000362378","123456",50000),new user("000362379","123456",50000),new user("000362370","123456",50000)];

function recuperarPosicion (account,password){
  var posicion = null;
  for(let i=0;i<users.length;i++){
    if(users[i].account === account && users[i].password === password){
      posicion = i;
    }
  }
  return posicion;
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//fuente implementacion rooms (multiples usuarios): https://es.stackoverflow.com/questions/304403/mostrar-las-rooms-en-socket-io

io.on('connection', (socket) => {
  socket.on('withdraw', msg => {
    const db = recuperarPosicion(msg.account, msg.password);
    console.log(msg);
    socket.join(msg.account);
    if(db != null ){
      if(users[db].balance > Number(msg.montoARetirar)){  
        users[db].balance -= Number(msg.montoARetirar);
        io.sockets.to(msg.account).emit('withdraw', "ok");
      }
    }else{                
      io.sockets.to(msg.account).emit('withdraw', "error");
    }
  });

  socket.on('check', msg => {
    const db = recuperarPosicion(msg.account, msg.password);
    socket.join(msg.account);
    if(db != null){
      io.sockets.to(msg.account).emit('check', users[db].balance);
    }else{
      io.sockets.to(msg.account).emit('check', "error");
    }   
    console.log(msg);
  });

  socket.on('consign', msg => {
    const db = recuperarPosicion(msg.account, msg.password);
    console.log(msg);
    socket.join(msg.account);
    if(db != null){
      users[db].balance += Number(msg.montoAconsignar);
      io.sockets.to(msg.account).emit('consign', "ok");
    }else{
      io.sockets.to(msg.account).emit('consign', "error");
    }  
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
