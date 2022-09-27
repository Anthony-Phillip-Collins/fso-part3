const ErrorName = Object.freeze({
  NotFound: 'NotFound',
  CastError: 'CastError',
  ValidationError: 'ValidationError',
});

const errorHandler = (err, req, res, next) => {
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

    case ErrorName.ValidationError:
      const key = Object.keys(err.errors).pop();
      res.status(400).json({ error: err.errors[key] });
      break;

    default:
      res.status(500).send('Something broke!');
  }
};

const modules = {
  errorHandler,
  ErrorName,
};

module.exports = modules;
