require('dotenv').config();

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
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
      unique: [true, 'Name already exists, has to be unique!'],
    },
    number: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(\d{2,3}-\d{6,})/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid phone number! It has to be at least 8 characters long and be formatted like 00-000000 or 000-000000.`,
      },
      required: true,
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

personSchema.plugin(uniqueValidator, {
  message: '{VALUE} already exists. The {PATH} has to be {TYPE}.',
});

const Person = model('Person', personSchema);

schemaIdToString(personSchema);
connect();

module.exports = Person;
