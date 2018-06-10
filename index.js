const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');


// port
const port = process.env.PORT || 3000;

//Server Instance
const server = http.createServer(app);

//declare socket
const io = socketIO(server);

app.get('/',(req, res) => res.send('Hello World!'));

io.on('connection',socket=>{
  console.log("a User connected");


  socket.on('disconnect',()=>{
    console.log("a User disconnected");
  })
});


// Emit Message
io.on('connection', function(socket){
  socket.on('message', function(msg){
    io.emit('message', msg);
    console.log('message: ' + msg);
    console.log(JSON.stringify(msg));
    determineReply(msg);
  });
});

server.listen(port,()=>{
  console.log("Listening on port :"+port);
});

function determineReply(msg) {
  var message = msg.message;
  var dt = new Date();
  console.log("here");
  if(message.includes("weather?")){
    var newMessage ={
      user:'LORD ADMIN',
      date: dt.getHours()+":"+dt.getMinutes(),
      message:"Hi Everyone, Today's Weather is XXX, Humidity of H, with temperature of T"
    }
    console.log("here again");
    io.emit('message',newMessage);
  }
}
