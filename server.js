const express = require("express");
const { type } = require("os");
const { animals } = require("./data/animals.json");
const PORT = process.env.PORT || 3001;
const fs = require("fs");
const path = require("path");

// instantiate the server
const app = express();

// parse incoming string or array data
// app.use = MIDDLEWARE, keeps route endpoint callback fx readable and reusable
// mounts function to server that request will pass through before getting to endpoint

// (express.urlencoded({ extended: true })) takes incoming POST data
// converts to key/value pair accessed in req.body object
// { extended: true }: there may be subarray data nested in it as well
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data into req.body JS object
app.use(express.json());

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];

  //   if we query by only 1 personality trait, returns a string only
  //  if we query multiple personality traits, we get an array of strings
  // we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    //   save personalityTraits as a dedicated array
    // if personalityTraits is a string, place into a new array and save
    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // loop through each trait in the personalityTraits array
    personalityTraitsArray.forEach((trait) => {
      // check trait against each animal in filteredResults array
      // it is initially a copy of the animalsArray but we're updating
      // it for each trait in .forEach() loop
      // for each trait targeted by filter, filteredResults array will only contain
      // entries that contain the trait so we'll have array of animals that have
      // every one of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        (animal) => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(
      (animal) => animal.diet === query.diet
    );
  }
  if (query.species) {
    filteredResults = filteredResults.filter(
      (animal) => animal.species === query.species
    );
  }
  if (query.name) {
    filteredResults = filteredResults.filter(
      (animal) => animal.name === query.name
    );
  }
  return filteredResults;
}

function findById(id, animalsArray) {
  const result = animalsArray.filter((animal) => animal.id === id)[0];
  return result;
}

// accepts POST route's req.body value and array we want to add data to
// execute this in app.post()'s callback fx
// add new data into animals.json
function createNewAnimal(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);
  //   synchronous fs.writeFile(), doesn't require callback fx
  // if writing to larger dataset, async version is better
  fs.writeFileSync(
    //   joins value of directory of file we execute code in with path to animals.json
    path.join(__dirname, "./data/animals.json"),
    //   save JS array data as JSON, null = we don't want to edit existing data
    // 2 = create white space between values to make more readable
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  // return finished code to post route for response
  return animal;
}

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== "string") {
    return false;
  }
  if (!animal.species || typeof animal.species !== "string") {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== "string") {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

// add route
// .get() takes a string describing route client fetches from
// and a callback fx that executes everytime route is accessed with GET req
app.get("/api/animals", (req, res) => {
  let results = animals;
  //   req.query is multifaceted, combining multiple parameters
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  // returns new filtered array
  //   res can also take .send()
  res.json(results);
});

// parameter route comes AFTER the other GET route
app.get("/api/animals/:id", (req, res) => {
  // req.param is specific to a SINGLE property
  // this route returns a single animal, id is unique
  // no query on a single animal so no need for all other code in filterbyQuery
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    // the specific animal asked for does not exist
    res.send(404);
  }
});

// define route that listens for POST requests
// package data as object and send to server
// writes new array data to animals.json
app.post("/api/animals", (req, res) => {
  // set id based on what the next index of the array will be
  // take length property of animals array and set as the id for new data
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send 400 error
  if (!validateAnimal(req.body)) {
    //   relay a message to the client making request
    res.status(400).send("The animal is not properly formatted.");
  } else {
    // add animal to json file and animals array in this fx
    // req.body is where our incoming content will be
    const animal = createNewAnimal(req.body, animals);

    // send data back to client
    res.json(animal);
  }
});

// make server listen
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
