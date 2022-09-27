require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const { errorHandler, ErrorName } = require('./middleware/errorHandler');
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
  const { name, number } = req.body;

  new Person({ name, number, date: new Date() })
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

  Person.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true }
  )
    .then((person) => {
      if (person) {
        res.status(200).json(person);
        return;
      }
      next({ name: ErrorName.NotFound, id });
    })
    .catch(next);
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
