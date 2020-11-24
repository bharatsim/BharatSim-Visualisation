const VALID_FILE_TYPES = ['text/csv'];
const MAX_FILE_SIZE = 10485760;

function isAbsent(value) {
  return value === null || value === undefined || value === '';
}

function isEmptyArray(value) {
  return Array.isArray(value) && !value.length;
}

function areAllFieldsSelected(value) {
  return value.some((ele) => ele === '');
}

function xAxisValidator(value = '') {
  if (isAbsent(value)) {
    return 'Please select value for x axis';
  }
  return '';
}

function yAxisValidator(value = []) {
  if (isAbsent(value)) {
    return 'Please select valid value for y axis';
  }
  if (isEmptyArray(value)) {
    return 'Please select value for y axis';
  }
  if (areAllFieldsSelected(value)) {
    return 'Please select value for y axis';
  }
  return '';
}

function datasourceValidator(value = '') {
  if (isAbsent(value)) {
    return 'Please select data source';
  }
  return '';
}

function validateFile(file) {
  if (!file) {
    return 'Please upload valid csv file';
  }
  if (!VALID_FILE_TYPES.includes(file.type)) {
    return 'Failed to Import file, the format is not supported';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Failed to Import file, size exceeds the limit of 10MB';
  }
  return '';
}

export { datasourceValidator, xAxisValidator, yAxisValidator, validateFile };
