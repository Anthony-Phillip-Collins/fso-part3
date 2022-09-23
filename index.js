const express = require('express');
const app = express();

const persons = [
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

app.get('/info', (request, response) => {
  response.send(`
      <p>Phonebook has info for ${persons.length} people.</p>
      <p>${new Date()}</p>
    `);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const found = persons.find((person) => person.id === id);
  if (found) {
    response.status(200).json(found);
  } else {
    response.status(404).json({ error: `Person with id ${id} doesn't exist!` });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
