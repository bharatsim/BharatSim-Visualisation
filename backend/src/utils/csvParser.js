const fs = require('fs');
const csvParser = require('papaparse');

const InvalidInputException = require('../exceptions/InvalidInputException');
const { csvParsingError } = require('../exceptions/errors');

const invalidCharRgx = /[^A-Za-z0-9-_ ]/g;
const invalidStartingChar = /^[^A-Za-z]/g;

function validateColumnName(name, fields, isEditMode = false) {
  if (isEditMode) {
    return '';
  }
  if (name === '') {
    return 'Column name is required';
  }
  if (name.match(invalidStartingChar)) {
    return 'Column name should be start with alphabets';
  }
  if (name.match(invalidCharRgx)) {
    return 'Column name can include alphabets, numbers, -, _ or space';
  }
  return fields.includes(name) ? 'Column Name should be unique' : '';
}

function validateCSVFile(csvData) {
  const {
    errors,
    meta: { fields },
  } = csvData;
  if (errors.length > 0) {
    return 'Please review the file and ensure that its a valid CSV file';
  }
  if (fields.some((field) => field.match(invalidStartingChar))) {
    return 'Column name should be start with alphabets';
  }
  if (fields.some((field) => field.match(invalidCharRgx))) {
    return 'Column name can include alphabets, numbers, -, _ or space';
  }
  return '';
}

function validateAndParseCSV(path) {
  const csvString = fs.readFileSync(path, 'utf-8');
  const csvData = csvParser.parse(csvString, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    transformHeader: (header) => header.toString().trim(),
  });
  const error = validateCSVFile(csvData);
  if (error) {
    throw new InvalidInputException(
      csvParsingError(error).errorMessage,
      csvParsingError(error).errorCode,
    );
  }
  return csvData.data;
}

module.exports = {
  validateAndParseCSV,
  validateColumnName,
};
