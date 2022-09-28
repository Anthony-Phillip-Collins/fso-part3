const ErrorName = Object.freeze({
  NotFound: 'NotFound',
  CastError: 'CastError',
  ValidationError: 'ValidationError',
});

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let message = '';
  switch (err.name) {
    case ErrorName.NotFound:
      message = 'Resource could not be found!';
      if (err.id) {
        message = 'Person no longer exist!';
      }
      res.status(404).json({ error: { message } });
      break;

    case ErrorName.CastError:
      message = 'Malformatted id!';
      res.status(400).json({ error: { message } });
      break;

    case ErrorName.ValidationError:
      res.status(400).json({ error: err.errors[Object.keys(err.errors).pop()] });
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
