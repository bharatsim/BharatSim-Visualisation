import { getFileExtension } from './fileUploadUtils';
import { MAX_FILE_SIZE, VALID_FILE_EXTENSIONS } from '../constants/fileUpload';

function isAbsent(value) {
  return value === null || value === undefined || value === '';
}

function isEmptyArray(value) {
  return Array.isArray(value) && !value.length;
}

function requiredValueForDropdown(value) {
  if (isAbsent(value)) {
    return 'Please select some value, this is mandatory field';
  }
  return '';
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

function geoMetricValidator(value = '') {
  if (isAbsent(value)) {
    return 'Please select value for geo metric';
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

function chartNameValidator(value = '') {
  if (isAbsent(value)) {
    return 'Please select chart name';
  }
  return '';
}

function validateFile(file) {
  if (!file) {
    return 'Please upload valid file';
  }
  if (!VALID_FILE_EXTENSIONS.includes(getFileExtension(file)) || file.name.indexOf('.') === -1) {
    return 'Failed to Import file, the format is not supported';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Failed to Import file, size exceeds the limit of 300MB';
  }
  return '';
}

export {
  requiredValueForDropdown,
  geoMetricValidator,
  datasourceValidator,
  xAxisValidator,
  yAxisValidator,
  validateFile,
  chartNameValidator,
};
