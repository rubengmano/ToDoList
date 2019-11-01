// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// tell the app to use ejs
// first is needed to install ejs module
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  let today = new Date();
  console.log(today);
  let currentDay = today.getDay();
  let day = '';

  switch(currentDay){
    case 0:
      day = 'Sunday';
      break;
    case 1:
      day = 'Monday';
      break;
    case 2:
      day = 'Tuesday';
      break;
    case 3:
      day = 'Wednesday';
      break;
    case 4:
      day = 'Thursday';
      break;
    case 5:
      day = 'Friday';
      break;
    case 6:
      day = 'Saturday';
      break;
  }

  // it's necessary to have a views folder and the file inside
  res.render('index', {weekDay: day});
});

app.listen(3000, () => console.log(`Server is up and running on port 3000.`));
