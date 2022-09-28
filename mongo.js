/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
require('dotenv').config();

const mongoose = require('mongoose');
const Person = require('./models/Person');

const [node, mongojs, password, name, number] = process.argv;
const readOnly = !name || !number;

const close = () => mongoose.connection.close();
const connect = () => {
  mongoose.connect(process.env.MONGODB_URI)
  // eslint-disable-next-line no-console
    .then(() => {
      // console.log('connection success');
    })
  // eslint-disable-next-line no-console
    .catch((error) => console.log('connection error', error.message));
};

const run = () => {
  connect();

  if (!readOnly) {
    new Person({
      name,
      number,
    })
      .save()
      .then((person) => {
        console.log(`${person.name} saved!`);
        close();
      })
      .catch((error) => {
        console.log('ERROR', error.message);
        close();
      });
  } else {
    Person.getAll()
      .then((persons) => {
        console.log(
          `phonebook: \n${persons
            .map((person) => `${person.name} ${person.number} \n`)
            .join('')}`,
        );
        close();
      })
      .catch((error) => {
        console.log(error.message);
        close();
      });
  }
};

if (!password) {
  console.log(
    `
      Please provide the password as an argument: node mongo.js <password>.
  
      You can also provide name and number to save an entry: node mongo.js <password> <name> <number>.
      `,
  );
  process.exit(1);
} else {
  run();
}
