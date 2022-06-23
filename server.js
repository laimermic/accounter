const express = require("express");
const app = express();
const http = require("http");
const { send } = require("process");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const connectionUrl = "mongodb://mongoadmin:mypasswd@10.115.3.9:8017";
app.use(express.static("public"));

//called on new connection
io.on("connection", (socket) => {
  sendStatus(true,"Connected!");
  function broadcastdata() {
    let response = {};
    console.log("broadcastdata has been called!\nConnecting to MongoDB...");
    MongoClient.connect(connectionUrl, async (err, db) => {
      if (err) {
        sendStatus(false, "Can not connect to database!");
        throw err;
      }
      console.log("Connection successfull!");
      console.log("Serving Transactions...");
      let dataBase = db.db("mydb");
      let accounterIncome = dataBase.collection("accounterIncome");
      accounterIncome.find({}).toArray(function (err, result) {
        response.income = result;
        let accounterExpenses = dataBase.collection("accounterExpenses");
        accounterExpenses.find({}).toArray(function (err, result2) {
          response.expenses = result2;
          socket.broadcast.emit("receiveData", response);
          socket.emit("receiveData", response);
          console.log("Transactions served!");
        });
      });
    });
  }

  console.log(socket.handshake.address + " connected");

  //called on disconnection
  socket.on("disconnect", function () {
    console.log(socket.handshake.address + " disconnected!");
  });

  //Sending full Data
  socket.on("queryData", () => {
    let response = {};
    console.log(
      "Client " +
        socket.handshake.address +
        " requested Data\nConnecting to MongoDB..."
    );
    MongoClient.connect(connectionUrl, async (err, db) => {
      if (err) {
        sendStatus(false, "Can not connect to database!");
        throw err;
      }
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

  //Insert income
  socket.on("insertIncomeData", (data) => {
    console.log(
      "Client " +
        socket.handshake.address +
        " inserts Income Transactions...\nConnecting to MongoDB..."
    );
    MongoClient.connect(connectionUrl, (err, db) => {
      if (err) {
        sendStatus(false, "Can not connect to database!");
        throw err;
      }
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
          broadcastdata();
          sendStatus(true, "Insertion successful!");
        }
      );
    });
  });

  //Insert expense
  socket.on("insertExpenseData", (data) => {
    console.log(
      "Client " +
        socket.handshake.address +
        "tries to insert expense (" +
        data +
        ")\nConnecting to MongoDB..."
    );
    MongoClient.connect(connectionUrl, (err, db) => {
      if (err) {
        sendStatus(false, "Can not connect to database!");
        throw err;
      }
      console.log("Connection successfull! Inserting Transaction now...");
      let dataBase = db.db("mydb");
      dataBase.collection("accounterExpenses").insertOne(data, (err, res) => {
        if (err) throw err;
        console.log("Insert successful!");
        sendStatus(true, "Insertion successful!");
        broadcastdata();
      });
    });
  });

  //Delete income
  socket.on("deleteIncome", (data) => {
    console.log(
      "Client " +
        socket.handshake.address +
        " tries to delete Income transaction " +
        data._id
    );
    console.log("Connecting to MongoDB...");
    MongoClient.connect(connectionUrl, (err, db) => {
      if (err) {
        sendStatus(false, "Can not connect to database!");
        throw err;
      }
      console.log("Connection successfull! Executing delete command...");
      let dataBase = db.db("mydb");
      dataBase
        .collection("accounterIncome")
        .deleteOne({ _id: new ObjectId(data) }, (err, result) => {
          if (err) {
            sendStatus(false, "Ran into an error while deleting!");
            throw err;
          }
          console.log("Deletion successful!");
          sendStatus(true, "Deletion successful!");
          broadcastdata();
        });
    });
  });

  //Delete expense
  socket.on("deleteExpense", (data) => {
    console.log(
      "Client " +
        socket.handshake.address +
        " tries to delete Expense transaction " +
        data
    );
    console.log("Connecting to MongoDB...");
    MongoClient.connect(connectionUrl, (err, db) => {
      if (err) {
        sendStatus(false, "Can not connect to database!");
        throw err;
      }
      console.log("Connection successfull");
      let dataBase = db.db("mydb");
      dataBase
        .collection("accounterExpenses")
        .deleteOne({ _id: new ObjectId(data) }, (err, res) => {
          if (err) {
            sendStatus(false, "Ran into an error while deleting!");
            throw err;
          }
          console.log("Deletion successful!");
          sendStatus(true, "Deletion successful!");
          broadcastdata();
        });
    });
  });

  //Edit income
  socket.on("editIncome", (data) => {
    console.log(
      "Client " +
        socket.handshake.address +
        " tries to edit Income transaction " +
        data._id +
        "\nConnecting to MongoDB..."
    );
    let transid = data._id;
    delete data._id;
    MongoClient.connect(connectionUrl, (err, db) => {
      if (err) {
        sendStatus(false, "Can not connect to database!");
        throw err;
      }
      console.log("Connection successfull! Executing update command...");
      let dataBase = db.db("mydb");
      dataBase
        .collection("accounterIncome")
        .updateOne(
          { _id: new ObjectId(transid) },
          { $set: data },
          { upsert: false },
          (err, res) => {
            if (err) {
              sendStatus(false, "Ran into an error while updating data!");
              throw err;
            }
            console.log("Update successful!");
            sendStatus(true, "Update successful!");
            broadcastdata();
          }
        );
    });
  });

  //Edit expense
  socket.on("editExpense", (data) => {
    console.log(
      "Client " +
        socket.handshake.address +
        " tries to edit Expense transaction " +
        data._id +
        "\nConnecting to MongoDB..."
    );
    let transid = data._id;
    delete data._id;
    MongoClient.connect(connectionUrl, (err, db) => {
      if (err) {
        sendStatus(false, "Can not connect to database!");
        throw err;
      }
      console.log("Connection successfull! Executing update command...");
      let dataBase = db.db("mydb");
      dataBase
        .collection("accounterExpenses")
        .updateOne(
          { _id: new ObjectId(transid) },
          { $set: data },
          { upsert: false },
          (err, res) => {
            if (err) {
              sendStatus(false, "Ran into an error while updating data!");
              throw err;
            }
            console.log("Update successful!");
            sendStatus(true, "Update successful!");
            broadcastdata();
          }
        );
    });
  });

  function sendStatus(status, msg) {
    let response = { status: status, msg: msg };
    console.log("Sending response...");
    socket.emit("responseMsg", response);
  }
});

//Start server
server.listen(8080, () => {
  console.log("listening on: 8080");
});
