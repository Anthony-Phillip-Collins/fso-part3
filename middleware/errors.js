const ErrorName = Object.freeze({
  NotFound: 'NotFound',
  CastError: 'CastError',
});

const errors = (err, req, res, next) => {
  console.log(err, req.params);

  let message = '';
  switch (err.name) {
    case ErrorName.NotFound:
      message = `Resource could not be found!`;
      if (err.id) {
        message = `Person with the id ${err.id} no longer exist!`;
      }
      res.status(404).json({ error: message });
      break;

    case ErrorName.CastError:
      res.status(400).json({ error: `malformatted id!` });
      break;

    default:
      res.status(500).send('Something broke!');
  }
};

const modules = {
  errors,
  ErrorName,
};

module.exports = modules;
