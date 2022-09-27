require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const { errors, ErrorName } = require('./middleware/errors');
const unknownEndpoint = require('./middleware/unknownEndpoint');
const Person = require('./models/Person');
const app = express();

morgan.token('payload', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '';
});

app.use(express.static('build'));
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] :response-time ms :payload')
);

app.get('/info', (req, res, next) => {
  Person.getAll()
    .then((persons) => {
      res.send(`
        <p>Phonebook has info for ${persons.length} people.</p>
        <p>${new Date()}</p>
      `);
    })
    .catch(next);
});

app.get('/api/persons', (req, res, next) => {
  Person.getAll()
    .then((persons) => {
      res.status(200).json(persons);
    })
    .catch(next);
});

app.post('/api/persons', async (req, res, next) => {
  const error = await validatePayload(req.body);

  if (error) {
    res.status(400).json({ error });
    return;
  }

  new Person(req.body)
    .save()
    .then((person) => {
      res.status(201).json(person);
    })
    .catch(next);
});

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;

  Person.findById(id)
    .then((person) => {
      if (person) {
        res.status(200).json(person);
      } else {
        next({ name: ErrorName.NotFound, id });
      }
    })
    .catch(next);
});

app.delete('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;

  Person.findByIdAndDelete(id)
    .then((person) => {
      if (person) {
        res.status(204).end();
        return;
      }
      next({ name: ErrorName.NotFound, id });
    })
    .catch(next);
});

app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;

  Person.findByIdAndUpdate(id, { number }, { new: true })
    .then((person) => {
      if (person) {
        res.status(200).json(person);
        return;
      }
      next({ name: ErrorName.NotFound, id });
    })
    .catch(next);
});

const validatePayload = async ({ name, number }) => {
  let error;
  if (!name && !number) {
    error = 'Payload requires name and number values!';
  } else if (!name) {
    error = 'Payload requires a name!';
  } else if (!number) {
    error = 'Payload requires a number!';
  }
  /*
   * commented out as per 3.14: "At this stage, the phonebook can have multiple entries for a person with the same name."
   *
  else {
    const exists = await nameExists(name);
    error = exists && `Person with the name ${name} already exists!`;
  }
   */
  return error;
};

const nameExists = async (name) => {
  const all = await Person.getAll();
  return all.find((p) => p.name.toLowerCase() === name.toLowerCase());
};

app.use(unknownEndpoint);
app.use(errors);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
