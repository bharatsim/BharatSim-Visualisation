const fs = require('fs');
const csvParser = require('papaparse');

const InvalidInputException = require('../exceptions/InvalidInputException');
const { csvParsingError } = require('../exceptions/errors');

function validateAndParseCSV(path) {
  const csvString = fs.readFileSync(path, 'utf-8');
  const { data, errors } = csvParser.parse(csvString, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });
  if (errors.length > 0) {
    throw new InvalidInputException(csvParsingError.errorMessage, csvParsingError.errorCode);
  }
  return data;
}

module.exports = {
  validateAndParseCSV,
};
