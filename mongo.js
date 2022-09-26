const mongoose = require('mongoose');
const { Person } = require('./models/Person');

const [node, mongojs, password, name, number] = process.argv;
const readOnly = !name || !number;

const databaseName = 'phonebook';
const userName = 'fullstackopen';

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

  connect();
};

const connect = () => {
  const url = `mongodb+srv://${userName}:${password}@cluster0.8cuke.mongodb.net/${databaseName}?retryWrites=true&w=majority`;
  mongoose
    .connect(url)
    .then((result) => run())
    .catch((error) => console.log(error.message));
};

const run = async () => {
  if (!readOnly) {
    await new Person({
      name,
      number,
      date: new Date(),
    }).save();

    console.log(`${name} saved!`);
  } else {
    const all = await Person.getAll();

    console.log(
      `phonebook: \n${all
        .map(({ name, number }) => `${name} ${number} \n`)
        .join('')}`
    );
  }

  mongoose.connection.close();
};

init();
