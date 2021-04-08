const fs = require("fs");
const path = require("path");


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
    path.join(__dirname, "../data/animals.json"),
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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};