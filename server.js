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
    let response = {};
    console.log(
      "Client " +
        socket.handshake.address +
        " requested Data...\nConnecting to MongoDB..."
    );
    MongoClient.connect(connectionUrl, async (err, db) => {
      if (err) throw err;
      console.log("Connection successfull!");
      console.log("Serving Transactions...");
      let dataBase = db.db("mydb");
      let accounterIncome = dataBase.collection("accounterIncome");
      accounterIncome.find({}).toArray(function (err, result) {
        response.income = result;
        let accounterExpenses = dataBase.collection("accounterExpenses");
        accounterExpenses.find({}).toArray(function (err, result2) {
          response.expenses = result2;
          socket.emit("receiveData", response);
          console.log("Transactions served!");
        });
      });
    });
  });

  socket.on("insertIncomeData", (data) => {
    console.log(
      "Client " +
        socket.handshake.address +
        " inserts Data...\nConnecting to MongoDB..."
    );
    MongoClient.connect(connectionUrl, (err, db) => {
      if (err) throw err;
      console.log("Connection successfull!");
      let dataBase = db.db("mydb");
      dataBase.collection("accounterIncome").insertOne(
        {
          amount: data.amount,
          usage: data.usage,
          date: data.date,
        },
        (err, res) => {
          if (err) throw err;
          console.log(res);
        }
      );
    });
  });

  socket.on("deleteIncome", (data) => {
    console.log(
      "Client " +
        socket.handshake.address +
        " tries to delete Income transaction " +
        data
    );
    console.log("Connecting to MongoDB...");
    MongoClient.connect(connectionUrl, (err, db) => {
      if (err) throw err;
      console.log("Connection successfull");
      let dataBase = db.db("mydb");
      dataBase.collection("accounterIncome").deleteOne({ _id: data });
    });
  });
});

server.listen(8080, () => {
  console.log("listening on: 8080");
});
