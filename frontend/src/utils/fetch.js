import axios from 'axios';
import { httpMethods } from '../constants/fetch';
import { errors, errorTypes } from '../constants/loaderAndErrorMessages';

let startLoader;
let stopLoader;
let showError;

function initLoader(startLoaderFunction, stopLoaderFunction, showErrorFunction) {
  startLoader = startLoaderFunction;
  stopLoader = stopLoaderFunction;
  showError = showErrorFunction;
}

function commandErrorHandler(err) {
  if (!err.response) {
    showError(errors[errorTypes.NETWORK_ERROR]());
    return Promise.reject();
  }
  if (err.response.status === errorTypes.GATEWAY_TIMEOUT) {
    showError(errors[errorTypes.GATEWAY_TIMEOUT]());
    return Promise.reject();
  }
  if (err.response.status === errorTypes.ADDRESS_NOT_FOUND) {
    showError(errors[errorTypes.ADDRESS_NOT_FOUND]());
    return Promise.reject();
  }
  if (err.response.status === errorTypes.TECHNICAL_ERROR) {
    showError(errors[errorTypes.TECHNICAL_ERROR]());
    return Promise.reject();
  }
  showError(errors[errorTypes.DEFAULT]());
  const { errorCode } = err.response.data;
  return Promise.reject({ errorCode, err });
}

function fetchData({
  url,
  method = httpMethods.GET,
  headers,
  data,
  query,
  isCustomErrorHandler = false,
}) {
  startLoader();
  return axios({ url, method, headers, data, params: query })
    .then((res) => {
      stopLoader();
      return res.data;
    })
    .catch((err) => {
      stopLoader();
      if (isCustomErrorHandler) {
        return Promise.reject(err);
      }
      return commandErrorHandler(err);
    });
}

function uploadData({
  url,
  method = httpMethods.POST,
  headers,
  data,
  query,
  isCustomErrorHandler,
}) {
  return fetchData({
    url,
    method,
    headers,
    data,
    params: query,
    isCustomErrorHandler,
  });
}

export { fetchData, uploadData, initLoader };
