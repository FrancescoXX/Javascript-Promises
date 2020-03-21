// import XMLHttpRequest.js
const XMLHttpRequest = require("./XMLHttpRequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();

// STEP 1
console.log("1-async start...");

// STEP 2
xhr.addEventListener("load", function () {
  console.log("2-", this.responseText);
});
xhr.open("GET", 'http://date.jsontest.com/');
xhr.send();

// STEP 3
console.log("3-async-hello....");

// STEP 4
console.log("4-async-world....");

// STEP ORDER EXECUTION: 1, 3, 4, 2 Because step 2 take a bit to complete