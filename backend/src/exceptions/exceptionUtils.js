const { technicalError } = require('./errors');

function sendServerError(err, res) {
  res.status(500).send({
    errorMessage: technicalError.errorMessage(err.message),
    errorCode: technicalError.errorCode,
  });
}

function sendClientError(err, res, statusCode = 400) {
  res.status(statusCode).send({
    errorMessage: err.errorMessage,
    errorCode: err.errorCode,
  });
}

module.exports = { sendClientError, sendServerError };
