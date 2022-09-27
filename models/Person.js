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
    name: {
      type: String,
      required: true,
      minlength: [3, 'The name has to be at least 3 characters long!'],
    },
    number: {
      type: String,
      required: true,
      minLength: [6, 'Number has to be at least 6 characters long!'],
    },
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
