const mongoose = require('mongoose');
const { Schema, model } = mongoose;

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

exports.Person = Person;
