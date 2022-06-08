const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const MongoClient = require("mongodb").MongoClient;
const connectionUrl = "mongodb://mongoadmin:mypasswd@10.115.3.9:8017";
app.use(express.static("public"));

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
        " requested Data...\nConnecting to MongoDB..."
    );
    MongoClient.connect(connectionUrl, (err, db) => {
      if (err) throw err;
      console.log("Connection successful");
      let dataBase = db.db("mydb");
      dataBase
        .collection("accounter")
        .find({})
        .toArray((err, result) => {
          if (err) throw err;
          console.log(result);
        });
    });
  });

  socket.on("insertIncomeData", (data) => {
    console.log("Client " + socket.handshake.address + " inserts Data...\nConnecting to MongoDB...");
    MongoClient.connect(connectionUrl, (err,db) => {
      if (err) throw err;
      console.log("Connection successfull");
      let dataBase = db.db("mydb");
      dataBase.collection("accounterIncome")
      .insertOne({
        amount: data.amount,
        usage: data.usage,
        date: data.date
      },(err,res) => {
        if (err) throw err;
        console.log(res);
      })
    })
  })
});

server.listen(8080, () => {
  console.log("listening on: 8080");
});
