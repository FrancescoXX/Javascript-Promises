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