# **An Introduction to Synchronous Code and Asynchronous Code handled with Promises**

In this short introduction, we grap some concepts about: 
- synchronous code
- asynchronous code
- Promises

# **Synchronous Code**

To understand what asynchronous code is, first we have to understand just one, important thing:

**Javascript is synchronous and single-threaded, so can only execute one task at the time**

```javascript
// sync.js
let sync = "sync start...";     // ↓ Declare a variable (a space in memory)
console.log(sync);              // ↓ Log the content of the variable
console.log("Hello Sync World");// ↓ Log another string

/* Output:
sync start...
Hello Sync World
*/

```
Surprised? No of course. This seems trivial, but is crucial.

Javascript executes the code STEP BY STEP, line by line, in sequential order, not at the same time, and each thing happens after each other.

The code on **STEP 2**

```javascript
console.log(sync)  
```
Won't execute until code on **STEP 1** is executed: 
```javascript
let sync = "SYNC"; 
```
Because the code on step 1 STOPS the code on step 2

This is generally a good thing, because we would get an error if we try to log the value **BEFORE** the memory assignment is physically done.

The sequential order is guaranteed, and is what we all want here!

# **Asynchronous Code ("Code that Take a bit")**

But the concept just explained, is not always the best solution to any problem.

What if we have some action, that "takes a bit" (think about http requests) ?

Tipically, we don't want our code to stop and wait, until this operation it's done (successfullt or not)

We can use callback functions. Here is an example of how to use callback functionsusing the fs function in Node.

```javascript
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
```
This is a wrong use of callback functions! The js code just skipped the async function and logged undefined as value of the wrongNumber variable.

To use them properly, we need to  wrap our code into a function, then call it as a callback in the other function:

```javascript
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
```
In this article we focus directly on how the Promises can help us.

# **Introduction to Javascript Promises**

## **Definition**
A Promise is good to handle asynchronous operations, in a simple way. 

A Promise works as a proxy: This means that we don't necessarily know the value to return at the moment of the Promise creation. 

Multiple promises can handle multiple asynchronous operations easily and provide good error handling.
___

## **What does it do?**
A promise allows to associate handlers with asynchronous action.

In the future, the handlers can resolves into: 
- SUCCESS, with value 
- FAILURE, with a reason 

This lets asynchronous methods return values like synchronous methods.

Instead of immediately returning the final value, which is sometimes impossible (think about http requests), 

the asynchronous method returns a **Promise** object, to give that value later.
___

## **States**
A Promise can be in four states:

- **PENDING**: still pending, not fulfilled or rejected yet.
- **RESOLVED**: Action related to Promise OK.
- **REJECTED**: Action related to Promise FAILED.
- **SETTLED**: RESOLVED or REJECTED.

When one of these options happens, the associated handlers queued up by a promise's then method are called. 

If the promise has already been resolved or rejected when a corresponding handler is attached, the handler will be called, so there is no race condition between an asynchronous operation completing and its handlers being attached.

Note: Promise.prototype.then() and Promise.prototype.catch() also return promises, so they can be chained.
___

## **We need a Callback function**

To create a Promise, we need a callback function, that  takes two arguments, **resolve** and **reject**.

This function will be the argument for the Promise constructor.

Inside the callback function, we decide the logic about when the function should:
  - resolve (be successfull)
  - reject (throw an error)

The callback can also include a try-catch block to handle when the function should invokes resolve/reject.

For example, This callback function waits for 2 seconds, then generate a random 1-100 value, and it fails if we roll over 50 or succed if we roll less than 50.

```javascript
function callback(resolve, reject) {
  
  //We simulate a delay in the response, with the setTimeout function
  setTimeout(() => {
    const limit = 50;
    const random = Date.now() % 100; //random value 1-100
    try {
      if (random >= limit) {
        throw new Error(`Rolled ${random}, over the limit: ${limit}.`);
      }
      resolve(random);
    }
    catch (err) {
      reject(`Error in callback : ${err}`); // returns Error Message
    }
  }, 2000);
}
```
___

## **Create a new Promise**

Promise constructor takes only ONE argument, a callback function.

This constructor is useful to wrap functions that do not already support promises:
```javascript
const promise = new Promise(callback);
```

**callback** is a function to be executed by the constructor, during the process of construction of the promise.  

When the constructor generates the new promise, it also generates a pair of functions for **resolve** and **reject**.

The returned value can be another promise object, in which case the promise gets dynamically inserted into the chain.

### **Promise Return value**
When called with the 'new' keyword, the Promise constructor returns a [Promise] object.  

The [Promise] object will go to state **settled**, when **resolve** or **reject** are invoked by the callback function. 
___

## **Promise base Methods**

- **resolve(VALUE)**:
  - Returns a Promise object in the state **RESOLVED**, with a given **VALUE**. 

    If the value has not a "then" method, the promise is resolved with the value.

    If the value has a then method, the returned promise will follow up that thenable, using its state.
    
    If we don't know if a value is a promise, we can use resolve(value), and work with that return value (as a Promise).

- **reject(REASON)**:
  - Returns a Promise object in the state **REJECTED**, with a given **REASON**.

___

## **Promise prototype**

- **Promise.prototype.constructor:**
  - Returns the function that created an instance's prototype. 
  - This is the Promise function by default.

- **Promise.prototype.then():**
  - Appends resolver and rejection handlers to the Promise.
    
  -  Returns a new promise resolving to the return value of the called handler. 
    
  -  If the promise was not handled, returns to its original settled value. 

- **Promise.prototype.catch():**
  - Appends a rejection handler to the Promise.
    
    Returns a new promise resolving to the return value of the callback if it is called, or to its original fulfillment value if the promise is resolved.

- **Promise.prototype.finally():**
  - Appends a handler to the promise, 
  
  - Returns a new promise, resolved when the original one is resolved. The handler is called when the promise is in the state **settled**.
___

## **Promise example**
```javascript
const limit = 50;

console.log(`New Callback function...`);

//First of all, we define a callback function, that takes two arguments, resolve and reject
function callback(resolve, reject) {

  //We simulate a delay in the response, with the setTimeout function
  setTimeout(() => {
    const limit = 50;
    const random = Date.now() % 100; //random value 1-100
    try {
      if (random >= limit) {
        throw new Error(`Rolled ${random}, over the limit: ${limit}.`);
      }
      resolve(random);
    }
    catch (err) {
      reject(`Error in callback : ${err}`); // returns Error Message
    }
  }, 2000);
}

//Create a new Promise, with the callback function as the only argument
console.log(`New Promise created with the callback function...`);
const promise = new Promise(callback);

//If we log the content of the Promise immidately, we see Promise { <pending> }
console.log(promise);


//How to consume a Promise
promise
  .then(val => {
    console.log(`FULFILLED: ${val}`);
  })
  .catch(err => {
    console.log(`REJECTED: ${err}`);
  })
  .finally(opt => {
    console.log(`FINALLY: this is optional`);
  });
```

## **Conclusion**

This was just an introduction to JavaScript Promises. 

The best benefit is that they lets us write asynchronous code in a very simple way without knowing what value will be returned in the future from the asynchronous code.

Promises are also chainable, and returning promises is good, becuase it  allows us to build chains of asynchronous operations.
