// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// require local module
const date = require(__dirname + '/date.js');

const app = express();

// tell the app to use ejs
// first is needed to install ejs module
app.set('view engine', 'ejs');
// Set the body parser to be abled to read
app.use(bodyParser.urlencoded({
  extended: true
}));
// Define the path to public files
app.use(express.static('public'));

// because of scope it's necessary to declare the variable at a global level
let items = ['Buy Food', 'Cook Food', 'Eat Food'];
let workItems = [];

app.get("/", (req, res) => {

  let day = date.getDate();
  // it's necessary to have a views folder and the file inside
  res.render('index', {
    ListTitle: day,
    newListItems: items
  });
});

app.post("/", (req, res) => {

  let newItem = req.body.newItem;

  console.log(req.body.list);

  if (req.body.list === 'Work') {
    workItems.push(newItem);
    res.redirect('/work');
  } else {
    items.push(newItem);
    // It's redirect to the get method to complete the ejs file
    res.redirect('/');
  }
});

app.get('/work', (req, res) => {
  res.render('index', {
    ListTitle: 'Work List',
    newListItems: workItems
  });
});


app.listen(3000, () => console.log(`Server is up and running on port 3000.`));
