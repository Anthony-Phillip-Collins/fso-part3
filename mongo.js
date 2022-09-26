require('dotenv').config();

const mongoose = require('mongoose');
const Person = require('./models/Person');

const [node, mongojs, password, name, number] = process.argv;
const readOnly = !name || !number;

const init = () => {
  if (!password) {
    console.log(
      `
      Please provide the password as an argument: node mongo.js <password>.
  
      You can also provide name and number to save an entry: node mongo.js <password> <name> <number>.
      `
    );
    process.exit(1);
  }
  run();
};

const run = () => {
  if (!readOnly) {
    new Person({
      name,
      number,
      date: new Date(),
    })
      .save()
      .then((person) => {
        console.log(`${person.name} saved!`);
      })
      .catch((error) => console.log(error.message));
  } else {
    Person.getAll()
      .then((persons) => {
        console.log(
          `phonebook: \n${persons
            .map(({ name, number }) => `${name} ${number} \n`)
            .join('')}`
        );
      })
      .catch((error) => console.log(error.message));
  }
  mongoose.connection.close();
};

init();
