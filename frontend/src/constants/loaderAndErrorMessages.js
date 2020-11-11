/* eslint-disable no-restricted-globals */

import { navigateToHome, navigateToPreviousPage, reloadPage } from '../utils/browserHistory';

const errorTypes = {
  NETWORK_ERROR: 'networkError',
  DEFAULT: 'default',
  ADDRESS_NOT_FOUND: 404,
  GATEWAY_TIMEOUT: 504,
  TECHNICAL_ERROR: 500,
  DASHBOARD_CREATE_FAILED: 'dashboardCreateFailed',
  PROJECT_AND_DASHBOARD_CREATE_FAILED: 'projectAndDashboardCreateFailed',
};

const errors = {
  1001: () => ({
    errorMessage: 'Failed to load page',
    errorTitle: 'Error while loading the page',
    helperText: 'Try to reload the page',
    errorModalButtonText: 'Okay',
    onErrorModalButtonClick: navigateToPreviousPage,
  }),
  1002: () => ({
    errorTitle: `Aw Snap! Failed to fetch data sources.`,
    errorMessage: 'one or more column name not found',
    errorModalButtonText: 'Okay',
    helperText: 'Try to reloading the page',
    onErrorModalButtonClick: navigateToPreviousPage,
  }),
  1003: () => ({
    errorMessage: 'Failed to load page',
    errorTitle: 'Error while loading the page',
    errorModalButtonText: 'Okay',
    helperText: 'Try to reload the page',
    onErrorModalButtonClick: navigateToPreviousPage,
  }),
  1004: () => ({
    errorMessage: 'Failed to load page',
    errorTitle: 'Error while loading the page',
    errorModalButtonText: 'Okay',
    helperText: 'Try to reload the page',
    onErrorModalButtonClick: navigateToPreviousPage,
  }),
  1005: () => ({
    errorMessage: 'Failed to load page',
    errorTitle: 'Error while loading the page',
    errorModalButtonText: 'Okay',
    helperText: 'Try to reload the page',
    onErrorModalButtonClick: navigateToPreviousPage,
  }),
  1008: (fileName, onOkay) => ({
    errorTitle: `Aw Snap! Failed to upload the file ${fileName}`,
    errorMessage: 'File might contain invalid data',
    helperText: 'Try to upload again',
    errorModalButtonText: 'Okay',
    onErrorModalButtonClick: onOkay,
  }),
  1009: (fileName, onOkay) => ({
    errorTitle: `Aw Snap! Failed to upload the file ${fileName}`,
    errorMessage: 'File is too large',
    helperText: 'Try to upload again',
    errorModalButtonText: 'Okay',
    onErrorModalButtonClick: onOkay,
  }),
  1010: (fileName, onOkay) => ({
    errorTitle: `Aw Snap! Failed to upload the file ${fileName}`,
    errorMessage: 'File type is not supported',
    helperText: 'Try to upload again',
    errorModalButtonText: 'Okay',
    onErrorModalButtonClick: onOkay,
  }),
  1011: (fileName, onOkay) => ({
    errorTitle: `Aw Snap! Failed to upload the file ${fileName}`,
    errorMessage: 'Error while parsing csv',
    helperText: 'Try to upload again',
    errorModalButtonText: 'Okay',
    onErrorModalButtonClick: onOkay,
  }),
  [errorTypes.GATEWAY_TIMEOUT]: () => ({
    errorTitle: `Aw Snap! Server is down`,
    errorMessage: 'Server is down',
    helperText: 'Try again after some time',
    errorModalButtonText: 'Reload',
    onErrorModalButtonClick: reloadPage,
  }),
  [errorTypes.ADDRESS_NOT_FOUND]: () => ({
    errorTitle: `Aw Snap! Address not found`,
    errorMessage: 'Something is wrong in url',
    helperText: 'Check url is correct or not',
    errorModalButtonText: 'Go to Home',
    onErrorModalButtonClick: navigateToHome,
  }),
  [errorTypes.NETWORK_ERROR]: () => ({
    errorTitle: `Aw Snap! Your Internet connection is lost`,
    errorMessage: 'No internet connection',
    helperText: 'Connect to internet',
    errorModalButtonText: 'Reload',
    onErrorModalButtonClick: reloadPage,
  }),
  [errorTypes.DEFAULT]: () => ({
    errorMessage: 'Something went wrong',
    errorTitle: 'Error while loading the page',
    helperText: 'Try to reload the page',
    errorModalButtonText: 'Reload',
    onErrorModalButtonClick: reloadPage,
  }),
  [errorTypes.TECHNICAL_ERROR]: () => ({
    errorMessage: 'Failed to load page',
    errorTitle: 'Error due to technical error at server',
    helperText: 'Try to reload the page',
    errorModalButtonText: 'Reload',
    onErrorModalButtonClick: reloadPage,
  }),
  [errorTypes.DASHBOARD_CREATE_FAILED]: (dashboardTitle) => ({
    errorTitle: `Aw Snap! Failed to create dashboard ${dashboardTitle}`,
    errorMessage: 'technical error at server',
    helperText: 'Try to create dashboard again',
    errorModalButtonText: 'Okay',
    onErrorModalButtonClick: () => {},
  }),
  [errorTypes.PROJECT_AND_DASHBOARD_CREATE_FAILED]: (projectTitle, dashboardTitle) => ({
    errorTitle: `Aw Snap! Failed to create project ${projectTitle} and dashboard ${dashboardTitle}`,
    errorMessage: 'technical error at server',
    helperText: 'Try to create dashboard again',
    errorModalButtonText: 'Okay',
    onErrorModalButtonClick: () => {},
  }),
};

export { errors, errorTypes };
