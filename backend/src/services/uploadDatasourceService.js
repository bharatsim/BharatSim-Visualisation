const fs = require('fs');

const dataSourceMetadataRepository = require('../repository/datasourceMetadataRepository');
const dataSourceRepository = require('../repository/datasourceRepository');
const { validateAndParseCSV } = require('../utils/csvParser');
const InvalidInputException = require('../exceptions/InvalidInputException');
const { fileTypes, MAX_FILE_SIZE } = require('../constants/fileTypes');
const { insertCSVDataInvalidData, fileTooLarge, wrongFileType } = require('../exceptions/errors');

async function insertMetadata(fileName, schema, dashboardId, fileType, fileSize) {
  return dataSourceMetadataRepository.insert({
    name: fileName,
    dataSourceSchema: schema,
    dashboardId,
    fileType,
    fileSize,
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
  if (fileType !== fileTypes.CSV) {
    throw new InvalidInputException(wrongFileType.errorMessage, wrongFileType.errorCode);
  }
  if (!fileSize || fileSize > MAX_FILE_SIZE) {
    throw new InvalidInputException(fileTooLarge.errorMessage, fileTooLarge.errorCode);
  }
}

async function uploadCsv(csvFile, requestBody) {
  const { schema, dashboardId } = requestBody;
  const schemaJson = JSON.parse(schema);
  const { path, originalname: fileName, mimetype: fileType, size } = csvFile;
  validateFileAndThrowException(fileType, size);
  const data = validateAndParseCSV(path);
  const { _id: metadataId } = await insertMetadata(
    fileName,
    schemaJson,
    dashboardId,
    fileType,
    size,
  );
  await insertCSVData(metadataId.toString(), data);
  return { collectionId: metadataId };
}
module.exports = { uploadCsv, deleteUploadedFile };
