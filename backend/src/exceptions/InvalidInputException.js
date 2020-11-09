const BaseException = require('./BaseException');

class InvalidInputException extends BaseException {
  constructor(errorMessage, errorCode) {
    super(`Invalid Input - ${errorMessage}`, errorCode);
    Object.setPrototypeOf(this, InvalidInputException.prototype);
  }
}

module.exports = InvalidInputException;
