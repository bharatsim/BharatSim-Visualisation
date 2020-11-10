const errorTypes = {
  NETWORK_ERROR: 'networkError',
  DEFAULT: 'default',
  ADDRESS_NOT_FOUND: 404,
  GATEWAY_TIMEOUT: 504,
  TECHNICAL_ERROR: 500,
};

const errors = {
  1001: () => ({
    errorMessage: 'Failed to load page',
    errorTitle: 'Error while loading the page',
    helperText: 'Try to reload the page',
  }),
  1002: () => ({
    errorTitle: `Aw Snap! Failed to fetch data sources.`,
    errorMessage: 'one or more column name not found',
    helperText: 'Try to reloading the page',
  }),
  1003: () => ({
    errorMessage: 'Failed to load page',
    errorTitle: 'Error while loading the page',
    helperText: 'Try to reload the page',
  }),
  1004: () => ({
    errorMessage: 'Failed to load page',
    errorTitle: 'Error while loading the page',
    helperText: 'Try to reload the page',
  }),
  1005: () => ({
    errorMessage: 'Failed to load page',
    errorTitle: 'Error while loading the page',
    helperText: 'Try to reload the page',
  }),
  1006: (data) => ({
    errorTitle: `Aw Snap! Failed to save project.${data.projectTitle}`,
    errorMessage: 'Error while creating new project with invalid data',
    helperText: 'Try to save again',
  }),
  1007: () => ({
    errorTitle: `Aw Snap! Failed to save project.`,
    errorMessage: 'Error while updating project with invalid data',
    helperText: 'Try to save again',
  }),
  1008: () => ({
    errorTitle: `Aw Snap! Failed to upload the file`,
    errorMessage: 'File might contain invalid data',
    helperText: 'Try to upload again',
  }),
  1009: () => ({
    errorTitle: `Aw Snap! Failed to upload the file`,
    errorMessage: 'File is too large',
    helperText: 'Try to upload again',
  }),
  1010: () => ({
    errorTitle: `Aw Snap! Failed to upload the file`,
    errorMessage: 'File type is not supported',
    helperText: 'Try to upload again',
  }),
  1011: () => ({
    errorTitle: `Aw Snap! Failed to upload the file`,
    errorMessage: 'Error while parsing csv',
    helperText: 'Try to upload again',
  }),
  [errorTypes.GATEWAY_TIMEOUT]: () => ({
    errorTitle: `Aw Snap! Server is down`,
    errorMessage: 'Server is down',
    helperText: 'Try again after some time',
  }),
  [errorTypes.ADDRESS_NOT_FOUND]: () => ({
    errorTitle: `Aw Snap! Address not found`,
    errorMessage: 'Something is wrong in url',
    helperText: 'Check url is correct or not',
  }),
  [errorTypes.NETWORK_ERROR]: () => ({
    errorTitle: `Aw Snap! Your Internet connection is lost`,
    errorMessage: 'No internet connection',
    helperText: 'Connect to internet',
  }),
  [errorTypes.DEFAULT]: () => ({
    errorMessage: 'Failed to load page',
    errorTitle: 'Error while loading the page',
    helperText: 'Try to reload the page',
  }),
  [errorTypes.TECHNICAL_ERROR]: () => ({
    errorMessage: 'Failed to load page',
    errorTitle: 'Error due to technical error at server',
    helperText: 'Try to reload the page',
  }),
};

export { errors, errorTypes };
