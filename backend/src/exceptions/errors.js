const errors = {
  columnNotFound: { errorCode: 1001, errorMessage: 'One or more columns not found' },
  dataSourceNotFound: {
    errorCode: 1002,
    errorMessage: (dataSourceName) => `datasource with id ${dataSourceName} not found`,
  },
  technicalError: { errorCode: 1003, errorMessage: (message) => `Technical error ${message}` },
  updateDashboardInvalidInput: {
    errorCode: 1004,
    errorMessage: 'Error while updating dashboard with invalid data',
  },
  insertDashboardInvalidInput: {
    errorCode: 1005,
    errorMessage: 'Error while inserting dashboard with invalid data',
  },
  insertProjectInvalidInput: {
    errorCode: 1006,
    errorMessage: 'Error while creating new project with invalid data',
  },
  updateProjectInvalidInput: {
    errorCode: 1007,
    errorMessage: 'Error while updating project with invalid data',
  },
  insertCSVDataInvalidData: {
    errorCode: 1008,
    errorMessage: 'Error while uploading csv file with invalid csv data',
  },
  fileTooLarge: {
    errorCode: 1009,
    errorMessage: 'File is too large',
  },
  wrongFileType: {
    errorCode: 1010,
    errorMessage: 'File type does not match',
  },
  csvParsingError: (error) => ({
    errorCode: 1011,
    errorMessage: `Error while parsing csv - ${error}`,
  }),
  projectNotFound: {
    errorCode: 1012,
    errorMessage: 'Project with given id not found',
  },
  metadataNotFound: {
    errorCode: 1013,
    errorMessage: 'Datasource Metadata for given id not found',
  },
  missingIds: {
    errorCode: 1014,
    errorMessage: 'Request is not complete',
  },
  invalidExpression: {
    errorCode: 1015,
    errorMessage: 'Given expression for column is invalid',
  },
  invalidColumnName: (error) => ({
    errorCode: 1016,
    errorMessage: `Invalid column name-${error}`,
  }),
};

module.exports = errors;
