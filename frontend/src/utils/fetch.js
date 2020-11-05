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

function fetchData({ url, method = httpMethods.GET, headers, data, query }) {
  startLoader();
  return axios({ url, method, headers, data, params: query })
    .then((res) => {
      stopLoader();
      return res.data;
    })
    .catch((err) => {
      stopLoader();
      showError();
      return Promise.reject(err);
    });
}

function uploadData({ url, method = httpMethods.POST, headers, data, query }) {
  return fetchData({
    url,
    method,
    headers,
    data,
    params: query,
  });
}

export { fetchData, uploadData, initLoader };
