import { isBefore } from 'date-fns';

import { parse } from 'mathjs';
import { getFileExtension } from './fileUploadUtils';
import { MAX_FILE_SIZE, VALID_FILE_EXTENSIONS } from '../constants/fileUpload';

const invalidCharRgx = /[^A-Za-z0-9-_ ]/g;
const invalidStartingCharRgx = /^[^A-Za-z]/g;

function isUndefined(value) {
  return value === null || value === undefined || value === '';
}

function validateFile(file) {
  if (!file) {
    return 'Please upload valid file';
  }
  if (!VALID_FILE_EXTENSIONS.includes(getFileExtension(file)) || file.name.indexOf('.') === -1) {
    return 'Failed to import file, the format is not supported';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Failed to import file, size exceeds the limit of 300MB';
  }
  return '';
}

function validateStepSize(value) {
  if (isUndefined(value)) {
    return 'Field is required';
  }
  if (value < 1) {
    return 'Step size should be greater than equal to 1';
  }
  if (value % 1 !== 0) {
    return 'Step size should be integer';
  }
  return '';
}

function validateWidth(value) {
  if (isUndefined(value)) {
    return 'Field is required';
  }
  if (value <= 0) {
    return 'Width should be greater than 0';
  }
  return '';
}

function validateOpacity(value) {
  if (isUndefined(value)) {
    return 'Field is required';
  }
  if (value < 0 || value > 1) {
    return 'Opacity should be between 0 to 1';
  }
  return '';
}

function validateToValueNumber(value, fromValue) {
  if (isUndefined(value)) {
    return 'Field is required';
  }
  if (Number(value) < Number(fromValue)) {
    return 'To value should be greater than from value';
  }
  return '';
}

function validateToValueDate(value, fromValue) {
  if (isUndefined(value)) {
    return 'Field is required';
  }
  if (isBefore(new Date(value), new Date(fromValue))) {
    return 'To value should be greater than from value';
  }
  return '';
}

function required(value) {
  return isUndefined(value) ? 'Field is required' : '';
}

function validateExpression(expression, fields) {
  if (!expression.trim()) {
    throw new Error('Expression can not be empty');
  }
  const parsedExpression = parse(expression);
  validateFields(parsedExpression, fields);
}

function validateField(field, fields) {
  if (!fields.includes(field)) {
    throw new Error(`${field} field does not exists`);
  }
}

function validateFields(node, fields) {
  if (node.type === 'ConstantNode' || node.type === 'SymbolNode') {
    if (node.type === 'SymbolNode') {
      validateField(node.name, fields);
      return;
    }
    if (node.type === 'ConstantNode' && typeof node.value === 'string') {
      validateField(node.value, fields);
      return;
    }
    return;
  }

  if (node.type === 'ParenthesisNode') {
    validateFields(node.content, fields);
    return;
  }

  node.args.forEach((arg) => {
    validateFields(arg, fields);
    if (arg.type === 'ParenthesisNode') {
      validateFields(arg.content, fields);
    }
  });
}

function validateColumnName(name, fields) {
  if (name === '') {
    return 'Column name is required';
  }
  if (name.match(invalidStartingCharRgx)) {
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
    return 'Failed to import file due to parsing error, Please review the file and ensure that its a valid CSV file';
  }
  if (fields.some((field) => field.match(invalidStartingCharRgx))) {
    return 'Failed to import file due to invalid column name, Column name should be start with alphabets';
  }
  if (fields.some((field) => field.match(invalidCharRgx))) {
    return (
      'Failed to import file due to invalid column name, ' +
      'Column name can include alphabets, numbers, -, _ or space'
    );
  }
  return '';
}

export {
  validateFile,
  required,
  validateStepSize,
  validateOpacity,
  validateToValueNumber,
  validateToValueDate,
  validateWidth,
  validateExpression,
  validateColumnName,
  validateCSVFile,
};
