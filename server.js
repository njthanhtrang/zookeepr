const fs = require("fs");
const path = require("path");
const express = require("express");
const { animals } = require("./data/animals.json");
// with require, index.js is default file read if no other file provided
const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");

// process.env.PORT is port 80
const PORT = process.env.PORT || 3001;
// instantiate the server
// app is a single instance of Express.js server
// everytime we call express() we create a new Express.js object
const app = express();

// provides a file path to location in our app (public folder)
// instruct server to make these files static resources
// using this, front-end code can be accessed without a specific server endpoint
app.use(express.static("public"));
// parse incoming string or array data with
// app.use (MIDDLEWARE), keeps route endpoint callback fx readable and reusable
// mounts function to server that request will pass through before getting to endpoint
// (express.urlencoded({ extended: true })) takes incoming POST data
// converts to key/value pair accessed in req.body object
// { extended: true }: there may be subarray data nested in it as well
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data into req.body JS object
app.use(express.json());
app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

// make server listen
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
