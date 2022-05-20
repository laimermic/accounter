var express = require("express"); // handles requests + responses
var path = require("path"); // path module provides utilities for working with file and directory paths
var bodyParser = require("body-parser"); //needed to parse request params

// create app
var app = express();

// configure app
// Serve Static Assets
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const PORT = process.env.PORT || 8080;

// Serve Static Assets
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log("Server connected at:", PORT);
});
