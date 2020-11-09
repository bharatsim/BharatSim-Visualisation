const BaseException = require('./BaseException');
const { columnNotFound } = require('./errors');

class ColumnsNotFoundException extends BaseException {
  constructor() {
    super(columnNotFound.errorMessage, columnNotFound.errorCode);
    Object.setPrototypeOf(this, ColumnsNotFoundException.prototype);
  }
}

module.exports = ColumnsNotFoundException;
