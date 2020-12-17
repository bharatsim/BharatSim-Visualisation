const fs = require('fs');

const dataSourceMetadataRepository = require('../repository/datasourceMetadataRepository');
const dashboardDatasourceMapRepository = require('../repository/dashboardDatasourceMapRepository');
const dataSourceRepository = require('../repository/datasourceRepository');
const { validateAndParseCSV } = require('../utils/csvParser');
const { getFileExtension } = require('../utils/uploadFile');
const InvalidInputException = require('../exceptions/InvalidInputException');
const { fileTypes, MAX_FILE_SIZE, EXTENDED_JSON_TYPES } = require('../constants/fileTypes');
const { insertCSVDataInvalidData, fileTooLarge, wrongFileType } = require('../exceptions/errors');

async function insertMetadata(fileName, schema, dashboardId, fileType, fileSize, fileId = '') {
  return dataSourceMetadataRepository.insert({
    name: fileName,
    dataSourceSchema: schema,
    dashboardId,
    fileType,
    fileSize,
    fileId,
  });
}

async function insertCSVData(metadataId, data) {
  try {
    await dataSourceRepository.bulkInsert(metadataId, data);
  } catch (error) {
    await dataSourceMetadataRepository.deleteDatasourceMetadata(metadataId);
    throw new InvalidInputException(
      insertCSVDataInvalidData.errorMessage,
      insertCSVDataInvalidData.errorCode,
    );
  }
}

function deleteUploadedFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.rmdirSync(filePath, { recursive: true });
  }
}

function validateFileAndThrowException(fileType, fileSize) {
  if (!fileSize || fileSize > MAX_FILE_SIZE) {
    throw new InvalidInputException(fileTooLarge.errorMessage, fileTooLarge.errorCode);
  }
}

async function uploadFile(file, requestBody) {
  const { originalname: fileName, size } = file;
  const fileType = getFileExtension(fileName);
  validateFileAndThrowException(fileType, size);
  if (fileType === fileTypes.JSON || EXTENDED_JSON_TYPES.includes(fileType)) {
    return uploadJson(file, requestBody);
  }
  if (fileType === fileTypes.CSV) {
    return uploadCsv(file, requestBody);
  }
  throw new InvalidInputException(wrongFileType.errorMessage, wrongFileType.errorCode);
}

async function uploadJson(file, requestBody) {
  const { dashboardId } = requestBody;
  const { originalname: fileName, size, filename: newFileName } = file;
  const fileType = getFileExtension(fileName);
  const { _id: metadataId } = await insertMetadata(
    fileName,
    {},
    dashboardId,
    fileType,
    size,
    newFileName,
  );
  await dashboardDatasourceMapRepository.insertDatasourceDashboardMap(
    metadataId.toString(),
    dashboardId,
  );
  return { collectionId: metadataId };
}

async function uploadCsv(inputFile, requestBody) {
  const { schema, dashboardId } = requestBody;
  const schemaJson = JSON.parse(schema);
  const { path, originalname: fileName, size } = inputFile;

  const trimmedFileName = fileName.trim();
  const data = validateAndParseCSV(path);
  const fileType = getFileExtension(trimmedFileName);
  validateFileAndThrowException(fileType, size);
  const { _id: metadataId } = await insertMetadata(
    trimmedFileName,
    schemaJson,
    dashboardId,
    fileType,
    size,
  );
  await insertCSVData(metadataId.toString(), data);
  await dashboardDatasourceMapRepository.insertDatasourceDashboardMap(
    metadataId.toString(),
    dashboardId,
  );
  return { collectionId: metadataId };
}

module.exports = { deleteUploadedFile, uploadFile };
