require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
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

app.get('/info', async (request, response) => {
  try {
    const persons = await Person.getAll();
    response.send(`
        <p>Phonebook has info for ${persons.length} people.</p>
        <p>${new Date()}</p>
      `);
  } catch (error) {
    response.status(500).json({ error: `There has been a server error.` });
  }
});

app.get('/api/persons', async (request, response) => {
  try {
    const persons = await Person.getAll();
    response.status(200).json(persons);
  } catch (error) {
    response.status(500).json({ error: `There has been a server error.` });
  }
});

app.post('/api/persons', async (request, response) => {
  const error = await validatePayload(request.body);

  if (error) {
    response.status(400).json({ ok: false, error });
    return;
  }

  try {
    const person = await new Person(request.body).save();
    response.status(201).json(person);
  } catch (error) {
    response.status(400).json({ ok: false, error });
  }
});

app.get('/api/persons/:id', async (request, response) => {
  const { id } = request.params;
  try {
    const person = await Person.findById(id);
    response.status(200).json(person);
  } catch (error) {
    response.status(404).json({ error: `Person with id ${id} doesn't exist!` });
  }
});

app.delete('/api/persons/:id', async (request, response) => {
  const { id } = request.params;

  try {
    await Person.findByIdAndDelete(id);
    response.status(204).end();
  } catch (error) {
    response
      .status(404)
      .json({ error: `Person with the id ${id} doesn’t exist!` });
  }
});

app.put('/api/persons/:id', async (request, response) => {
  const { id } = request.params;
  const { name, number } = request.body;

  try {
    const person = await Person.findByIdAndUpdate(
      id,
      { name, number },
      {
        new: true,
      }
    );
    response.status(200).json(person);
  } catch (error) {
    response
      .status(404)
      .json({ error: `Person with the id ${id} doesn’t exist!` });
  }
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
