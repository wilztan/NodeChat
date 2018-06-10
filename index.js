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
    var weather = getWeather("Beijing");
    var newMessage ={
      user:'LORD ADMIN',
      date: dt.getHours()+":"+dt.getMinutes(),
      message:"Hi Everyone, Today's Weather will be "+weather.weather.description+", Humidity of "+weather.main.Humidity+", with temperature of "+(weather.main.temp)/10+""
    }
    console.log("here again");
    io.emit('message',newMessage);
  }
}

function getWeather(city) {
  var Weahterresult="";
  countryCode = "CN";
  var url = "http://api.openweathermap.org/data/2.5/weather?q="+city+","+countryCode+"&appid=50817e1815a7186ed5800037c259576f";
  fetch(url)
  .then(response => response.json())
  .then(result => watherresult = result)
  .catch(e => alert(e));
  return Weahterresult;
}
