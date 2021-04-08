const router = require("express").Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require("../../lib/animals");
const { animals } = require("../../data/animals.json");

// add route
// .get() takes a string describing route client fetches from
// and a callback fx that executes everytime route is accessed with GET req
router.get("/animals", (req, res) => {
    let results = animals;
    //   req.query is multifaceted, combining multiple parameters
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    // returns new filtered array, res can also take .send()
    res.json(results);
  });
  
  // parameter route comes AFTER the other GET route
  router.get("/animals/:id", (req, res) => {
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
  router.post("/animals", (req, res) => {
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
  
  module.exports = router;