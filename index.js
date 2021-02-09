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

io.on('connection', (socket) => {
  socket.on('withdraw', msg => {
    const db = recuperarPosicion(msg.account, msg.password);
    console.log(msg);
    if(db != null ){
      if(users[db].balance > Number(msg.montoARetirar)){  
        users[db].balance -= Number(msg.montoARetirar);
        io.emit('withdraw', "ok");
      }
    }else{                
      io.emit('withdraw', "error");
    }
    io.close();
  });

  socket.on('check', msg => {
    const db = recuperarPosicion(msg.account, msg.password);
    if(db != null){
      io.emit('check', users[db].balance);
    }else{
      io.emit('check', "error");
    }   
    console.log(msg);
    io.close();
  });

  socket.on('consign', msg => {
    const db = recuperarPosicion(msg.account, msg.password);
    console.log(msg);
    if(db != null){
      users[db].balance += Number(msg.montoAconsignar);
      io.emit('consign', "ok");
    }else{
      io.emit('consign', "error");
    }
    io.close();    
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
