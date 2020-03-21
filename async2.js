const fs = require('fs');

//NO
let wrongNumber = undefined;
function wrongAddOne() {
  fs.readFile('number.txt', function doneReading(err, file) {
    wrongNumber = parseInt(file) + 1;
  })
}

wrongAddOne()
console.log(wrongNumber) // undefined -- executed before readFile execution

//YES
let number = undefined;
function addOne(callback) {
  fs.readFile('number.txt', function doneReading(err, file) {
    number = parseInt(file) + 1;
    callback(); //call callback function!
  })
}

//wrap the log into a function
function callbackLog() {
  console.log(number);
}
addOne(callbackLog); //5