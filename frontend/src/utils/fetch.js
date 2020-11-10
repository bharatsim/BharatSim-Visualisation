import axios from 'axios';
import { httpMethods } from '../constants/fetch';
import { errorTypes } from '../constants/loaderAndErrorMessages';

let startLoader;
let stopLoader;
let showError;

function initLoader(startLoaderFunction, stopLoaderFunction, showErrorFunction) {
  startLoader = startLoaderFunction;
  stopLoader = stopLoaderFunction;
  showError = showErrorFunction;
}

function handleError(err) {
  if (!err.response) {
    showError(errorTypes.NETWORK_ERROR);
    return Promise.reject();
  }
  if (err.response.status === errorTypes.GATEWAY_TIMEOUT) {
    showError(errorTypes.GATEWAY_TIMEOUT);
    return Promise.reject();
  }
  if (err.response.status === errorTypes.ADDRESS_NOT_FOUND) {
    showError(errorTypes.ADDRESS_NOT_FOUND);
    return Promise.reject();
  }
  if (err.response.status === errorTypes.TECHNICAL_ERROR) {
    showError(errorTypes.TECHNICAL_ERROR);
    return Promise.reject();
  }
  const { errorCode } = err.response.data;
  return Promise.reject({ errorCode, err });
}

function fetchData({ url, method = httpMethods.GET, headers, data, query }) {
  startLoader();
  return axios({ url, method, headers, data, params: query })
    .then((res) => {
      stopLoader();
      return res.data;
    })
    .catch((err) => {
      stopLoader();
      return handleError(err);
    });
}

function uploadData({ url, method = httpMethods.POST, headers, data, query, messages }) {
  return fetchData({
    url,
    method,
    headers,
    data,
    params: query,
    messages,
  });
}

export { fetchData, uploadData, initLoader };
