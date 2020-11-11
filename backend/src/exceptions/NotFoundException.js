const BaseException = require('./BaseException');

class NotFoundException extends BaseException {
  constructor(errorMessage, errorCode) {
    super(`Not found - ${errorMessage}`, errorCode);
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

module.exports = NotFoundException;
