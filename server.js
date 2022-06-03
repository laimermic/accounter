const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/public/index.html");
// });

io.on("connection", (socket) => {
  console.log(socket.handshake.address + " connected");

  socket.on("disconnect", function () {
    console.log(socket.handshake.address + " disconnected!");
  });

  io.on("hello", (hellomsg) => {
    console.log("hellomessage sents");
  });
});

server.listen(8080, () => {
  console.log("listening on: 8080");
});
