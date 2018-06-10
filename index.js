const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');


// port
const port = 4001
// const port = process.env.PORT || 3000;

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
  console.log("here");
  if(message.includes("weather?")){
    getWeather("Beijing");
  }
}

function getWeather(city) {
  countryCode = "CN";
  var dt = new Date();
  var url = "http://api.openweathermap.org/data/2.5/weather?q="+city+","+countryCode+"&appid=50817e1815a7186ed5800037c259576f";
  axios.get(url)
  .then(response => {
    var weather = response.data;
    console.log(JSON.stringify(weather));
    var newMessage ={
      user:'LORD ADMIN',
      date: dt.getHours()+":"+dt.getMinutes(),
      message:"Hi Everyone, Today's Weather will be "+response.data.weather[0].description+", Humidity of "+response.data.main.humidity+", with temperature of "+((response.data.main.temp)/10)toFixed(1)+" C"
    }
    io.emit('message',newMessage);
  })
  .catch(error => {
    console.log(error);
  });
}
