module.exports = (message, code) => {
  const err = new Error(message);
  err.statusCode = code || 500;
  return err
}