// export the function inside the module without the parenthesis so we can allow our main file to call the function whenever it's needed
module.exports.getDate = getDate;

function getDate() {
  let today = new Date();
  let currentDay = today.getDay();

  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }

  return today.toLocaleDateString("en-US", options);
}

module.exports.getDay = getDay;

function getDay() {
  let today = new Date();
  let currentDay = today.getDay();

  let options = {
    weekday: 'long'
  }

  return today.toLocaleDateString("en-US", options);
}
