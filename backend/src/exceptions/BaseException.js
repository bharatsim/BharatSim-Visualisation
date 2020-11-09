class BaseException extends Error {
  constructor(errorMessage, errorCode) {
    super(`${errorCode} - ${errorMessage}`);
    this.errorMessage = errorMessage;
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, BaseException.prototype);
  }
}

module.exports = BaseException;
