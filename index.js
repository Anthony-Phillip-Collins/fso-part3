const express = require('express');
const morgan = require('morgan');

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

app.get('/info', (request, response) => {
  response.send(`
      <p>Phonebook has info for ${persons.length} people.</p>
      <p>${new Date()}</p>
    `);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.post('/api/persons', (request, response) => {
  const error = validatePayload(request.body);
  if (error) {
    response.status(400).json({ ok: false, error });
  } else {
    const person = { ...request.body, id: getUniqueId() };
    persons.push(person);
    response.status(200).json(person);
  }
});

const validatePayload = ({ name, number }) => {
  let error;
  if (!name && !number) {
    error = 'Payload requires name and number values!';
  } else if (!name) {
    error = 'Payload requires a name!';
  } else if (!number) {
    error = 'Payload requires a number!';
  } else if (persons.find((p) => p.name.toLowerCase() === name.toLowerCase())) {
    error = `Person with the name ${name} already exists!`;
  }
  return error;
};

const getUniqueId = () => Math.max(...persons.map(({ id }) => id)) + 1;

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
