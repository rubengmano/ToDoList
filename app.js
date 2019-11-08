// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// require mongoose model
const mongoose = require('mongoose');

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

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

// // because of scope it's necessary to declare the variable at a global level
// let items = ['Buy Food', 'Cook Food', 'Eat Food'];
// let workItems = [];

// connect and create or change to db
mongoose.connect('mongodb://localhost/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true });

// Check if the connection was succefull
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection Succefull");
});

// ---------------------------------------SCHEMAS---------------------------------------------------------
// Create Schema
const itemsSchema = new mongoose.Schema({
  name: String
});

// Create list schema for dynamic routes
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

// ---------------------------------------COLLECTIONS-----------------------------------------------------
// Mongoose will convert the word Fruit into plurar to crate a collection
const Item = mongoose.model('Item', itemsSchema);
const List = mongoose.model('List', listSchema);

// ----------------------------------------DOCUMENTS------------------------------------------------------
const item1 = new Item({
  name: 'Welcome to the List'
});

const item2 = new Item({
  name: 'Hit the + button to add a new Item'
});

const item3 = new Item({
  name: '<-- Hit this to delete an item'
});

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {

//--------------------------------------FIND-DOCUMENTS--------------------------------------------------

  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0){
// ----------------------------------------ADD-DOCUMENTS-------------------------------------------------
      Item.insertMany(defaultItems, function(err){
        if(err) console.log(err);
        else console.log('Succefully saved default Items');
      });
      // render the objects after adding them to the db
      res.redirect('/');
    }
    else {
      // it's necessary to have a views folder and the file inside
      res.render('index', {
        ListTitle: 'Today',
        newListItems: foundItems
      });
    }
  });
});

// Creating dynamic routes
app.get('/:customListName', (req, res) => {
  const customListName = req.params.customListName;

  // Check if a list already exists in db
  List.findOne({name: customListName}, function (err, foundLists) {
    if(!err){
      if(!foundLists){
        // Create new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        // Save new List
        list.save();

        // Redirect to the dynamic route
        res.redirect('/' + customListName);
      } else {
        // render list if it already exists
        res.render('index', {
          ListTitle: foundLists.name,
          newListItems: foundLists.items
        });
      }
    } else console.log(err);
  });
});

app.post("/", (req, res) => {

  const itemName = req.body.newItem;
  // get the list name
  const listName = req.body.list;
  // Create the new item
  const item = new Item({
    name: itemName
  });

  // Check in which list we need to add the item
  if(listName === 'Today'){
    // save the new item into the collection
    item.save();

    // render the objects after adding them to the db
    res.redirect('/');
  } else {
    // find the correct list
    List.findOne({name: listName}, (err, foundList) => {
      // Add the new item to the list
      foundList.items.push(item);
      // Save the List to the db
      foundList.save();
      // Redirect to the dynamic route
      res.redirect('/' + listName);
    });
  }
});

// Delete Items
app.post("/delete", (req, res) => {

  // get the item id
  const checkedItemId = req.body.checkbox;

  // delete the item
  Item.findByIdAndRemove(checkedItemId, function(err){
    if(err) console.log(err);
    else console.log(`Succefully deleted item with id: ${checkedItemId}`);
  });

  setTimeout(function(){
    // render the objects after adding them to the db
    res.redirect('/');
  }, 100);


});

app.listen(3000, () => console.log(`Server is up and running on port 3000.`));
