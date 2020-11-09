const BaseException = require('./BaseException');
const { dataSourceNotFound } = require('./errors');

class DatasourceNotFoundException extends BaseException {
  constructor(dataSourceName) {
    super(dataSourceNotFound.errorMessage(dataSourceName), dataSourceNotFound.errorCode);
    Object.setPrototypeOf(this, DatasourceNotFoundException.prototype);
  }
}

module.exports = DatasourceNotFoundException;
