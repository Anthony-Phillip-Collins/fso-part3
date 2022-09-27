module.exports = (request, response) => {
  response.status(404).json({ error: { message: 'unknown endpoint' } });
};
