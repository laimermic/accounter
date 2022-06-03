const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const MongoClient = require("mongodb").MongoClient;
const connectionUrl = "mongodb://mongoadmin:mypasswd@10.115.3.9:8017";
app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/public/index.html");
// });

io.on("connection", (socket) => {
  socket.client._packet;
  console.log(socket.handshake.address + " connected");

  socket.on("disconnect", function () {
    console.log(socket.handshake.address + " disconnected!");
  });

  socket.on("queryData", () => {
    console.log(
      "Client " +
        socket.handshake.address +
        "requested Data...\n Connecting to MongoDB..."
    );
    MongoClient.connect(connectionUrl, (err, db) => {
      if (err) throw err;
      let dataBase = db.db("mydb");
      dataBase
        .collection("accounter")
        .find({})
        .toArray((err, result) => {
          if (err) throw err;
          console.log(result);
          dataBase.close();
        });
    });
  });
});

server.listen(8080, () => {
  console.log("listening on: 8080");
});
