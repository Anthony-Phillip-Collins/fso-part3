const express = require('express');
const app = express();

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/', (request, response) => {
  response.json({ hello: 'world' });
});

// app.delete('/api/persons/:id', (req, res) => {
//   const person = getPersonById(requerst.params.id);
//   res.status(200).send(`DELETE Request Called ${req.params.id}`);
// });

app.get('/info', (request, response) => {
  response.send(`
      <p>Phonebook has info for ${persons.length} people.</p>
      <p>${new Date()}</p>
    `);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

const getPersonById = (id) =>
  persons.find((person) => person.id === Number(id));

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = getPersonById(id);
  if (person) {
    response.status(200).json(person);
  } else {
    response.status(404).json({ error: `Person with id ${id} doesn't exist!` });
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = getPersonById(id);

  if (person) {
    persons = persons.filter((p) => p.id !== Number(id));
    response.status(204).end();
  } else {
    response
      .status(404)
      .json({ error: `Person with the id ${id} doesn’t exist!` });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
