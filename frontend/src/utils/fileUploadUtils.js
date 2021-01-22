import csvParser from 'papaparse';
import dataTypesMapping from '../constants/dataTypesMapping';
import csvParserConfig from '../config/csvParserConfig';
import { loaderStates } from '../hook/useLoader';

function getMessage(fileUploadStatus, fileName) {
  return {
    [loaderStates.ERROR]: `Error occurred while unloading ${fileName}`,
    [loaderStates.SUCCESS]: `${fileName} successfully uploaded`,
    [loaderStates.LOADING]: `uploading ${fileName}`,
  }[fileUploadStatus];
}

function createSchema(row) {
  return Object.keys(row).reduce((acc, element) => {
    acc[element] = dataTypesMapping[typeof row[element]];
    return acc;
  }, {});
}

function parseCsv(csvFile, previewLimit, onComplete, onError) {
  csvParser.parse(csvFile, {
    ...csvParserConfig,
    preview: previewLimit,
    complete: onComplete,
    error: onError,
  });
}

function parseJson(file, onParseComplete) {
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      onParseComplete({ errors: [], data: JSON.parse(evt.target.result) });
    } catch (err) {
      onParseComplete({ errors: [err.toString()], data: {} });
    }
  };
  reader.readAsText(file);
}

function resetFileInput(fileInput) {
  // eslint-disable-next-line no-param-reassign
  fileInput.value = '';
  // eslint-disable-next-line no-param-reassign
  fileInput.files = null;
}

function createColumnForMTable(schema) {
  return Object.keys(schema).map((fieldName) => ({
    title: fieldName,
    field: fieldName,
    dataType: schema[fieldName],
  }));
}

function getFileExtension(file) {
  const splitText = file.name.split('.');
  return splitText[splitText.length - 1];
}

export {
  getMessage,
  createSchema,
  parseCsv,
  resetFileInput,
  createColumnForMTable,
  parseJson,
  getFileExtension,
};
