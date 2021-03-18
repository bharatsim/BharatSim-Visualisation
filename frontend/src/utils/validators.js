import { getFileExtension } from './fileUploadUtils';
import { MAX_FILE_SIZE, VALID_FILE_EXTENSIONS } from '../constants/fileUpload';

function isUndefined(value) {
  return value === null || value === undefined || value === '';
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

function required(value) {
  return isUndefined(value) ? 'Field is required' : '';
}

export { validateFile, required };
