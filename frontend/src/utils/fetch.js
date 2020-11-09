import axios from 'axios';
import { httpMethods } from '../constants/fetch';

let startLoader;
let stopLoader;
let showError;

function initLoader(startLoaderFunction, stopLoaderFunction, showErrorFunction) {
  startLoader = startLoaderFunction;
  stopLoader = stopLoaderFunction;
  showError = showErrorFunction;
}
const defaultMessages = {
  errorMessage: 'Failed to load page',
  errorTitle: 'Error while loading the page',
  loading: 'Loading...',
  helperText: 'Try to reload the page',
};
function fetchData({
  url,
  method = httpMethods.GET,
  headers,
  data,
  query,
  messages = defaultMessages,
}) {
  startLoader(messages.loading);
  return axios({ url, method, headers, data, params: query })
    .then((res) => {
      stopLoader();
      return res.data;
    })
    .catch((err) => {
      stopLoader();
      showError({
        errorMessage: messages.errorTitle,
        ...messages,
      });
      return Promise.reject(err);
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
