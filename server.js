const express = require("express");
const { type } = require("os");
const { animals } = require("./data/animals.json");

// instantiate the server
const app = express();

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

// add route
// .get() takes a string describing route client fetches from
// and a callback fx that executes everytime route is accessed with GET req
app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  // returns new filtered array
  //   res can also take .send()
  res.json(results);
});

// make server listen
app.listen(3001, () => {
  console.log("API server now on port 3001!");
});
