// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// tell the app to use ejs
// first is needed to install ejs module
app.set('view engine', 'ejs');
// Set the body parser to be abled to read
app.use(bodyParser.urlencoded({extended: true}));

// because of scope it's necessary to declare the variable at a global level
let items = ['Buy Food', 'Cook Food', 'Eat Food'];

app.get("/", (req, res) => {
  let today = new Date();
  console.log(today);
  let currentDay = today.getDay();

  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }

  let day = today.toLocaleDateString("en-US", options);

  // it's necessary to have a views folder and the file inside
  res.render('index', {weekDay: day, newListItems: items});
});

app.post("/", (req, res) => {
  var newItem = req.body.newItem;
  items.push(newItem);
  // It's redirect to the get method to complete the ejs file
  res.redirect('/');
});

app.listen(3000, () => console.log(`Server is up and running on port 3000.`));
