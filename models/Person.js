require('dotenv').config();

const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { schemaIdToString } = require('./util');
const url = process.env.MONGODB_URI;

const connect = () => {
  mongoose
    .connect(url)
    .then((result) => console.log('Mongo connection success.'))
    .catch((error) => console.log(error.message));
};

const personSchema = new Schema(
  {
    name: String, // String is shorthand for {type: String}
    number: String,
    date: { type: Date, default: Date.now },
  },
  {
    statics: {
      getAll() {
        return this.find({});
      },
    },
  }
);

const Person = model('Person', personSchema);

schemaIdToString(personSchema);
connect();

module.exports = Person;
