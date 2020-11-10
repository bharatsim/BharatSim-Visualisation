/* eslint-disable import/first */
import axios from 'axios';

import { fetchData, uploadData, initLoader } from '../fetch';

jest.mock('axios', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve({ data: 'Hello test' })),
}));

describe('Fetch util', () => {
  const startLoader = jest.fn();
  const stopLoader = jest.fn();
  const showError = jest.fn();
  initLoader(startLoader, stopLoader, showError);
  it('should return data from server for given url', () => {
    fetchData({ url: 'test/api' });
    expect(axios).toHaveBeenCalledWith({
      data: undefined,
      headers: undefined,
      method: 'get',
      url: 'test/api',
    });
  });

  it('should return data from server for given url, data, method, header', () => {
    fetchData({ url: 'test/api', data: 'data', method: 'post', headers: 'header' });

    expect(axios).toHaveBeenCalledWith({
      data: 'data',
      headers: 'header',
      method: 'post',
      url: 'test/api',
    });
  });

  it('should upload file for given url and file', () => {
    uploadData({ url: 'test/api', headers: 'headers', data: 'data' });

    expect(axios).toHaveBeenCalledWith({
      data: 'data',
      headers: 'headers',
      method: 'post',
      url: 'test/api',
    });
  });
  it('should return rejected promise with error code and err if api return client side error', async () => {
    axios.mockImplementationOnce(() =>
      Promise.reject({ response: { status: 400, data: { errorCode: '1001' } } }),
    );
    try {
      await fetchData({ something: 'bad' });
    } catch (err) {
      expect(err).toEqual({
        err: { response: { data: { errorCode: '1001' }, status: 400 } },
        errorCode: '1001',
      });
    }
  });

  it('should call show error with 500 as error code if api return technical error', async () => {
    axios.mockImplementationOnce(() =>
      Promise.reject({ response: { status: 500, data: { errorCode: '1001' } } }),
    );
    try {
      await fetchData({ something: 'bad' });
    } catch (err) {
      expect(showError).toHaveBeenCalledWith(500);
    }
  });

  it('should call show error with 404 as error code if api return address not found error', async () => {
    axios.mockImplementationOnce(() =>
      Promise.reject({ response: { status: 404, data: { errorCode: '1001' } } }),
    );
    try {
      await fetchData({ something: 'bad' });
    } catch (err) {
      expect(showError).toHaveBeenCalledWith(404);
    }
  });

  it('should call show error with 504 as error code if api return gateway timeout error', async () => {
    axios.mockImplementationOnce(() =>
      Promise.reject({ response: { status: 504, data: { errorCode: '1001' } } }),
    );
    try {
      await fetchData({ something: 'bad' });
    } catch (err) {
      expect(showError).toHaveBeenCalledWith(504);
    }
  });

  it('should call show error with NETWORK_ERROR as error code if api return no internet error', async () => {
    axios.mockImplementationOnce(() => Promise.reject({}));
    try {
      await fetchData({ something: 'bad' });
    } catch (err) {
      expect(showError).toHaveBeenCalledWith('networkError');
    }
  });

  it('should start loader while fetching the data', async () => {
    fetchData({ url: 'test/api', data: 'data', method: 'post', headers: 'header' });

    expect(startLoader).toHaveBeenCalled();
  });

  it('should stop loader after date is fetched', async () => {
    await fetchData({ url: 'test/api', data: 'data', method: 'post', headers: 'header' });

    expect(stopLoader).toHaveBeenCalled();
  });

  it('should show error after any error while fetching and stop loader', async () => {
    axios.mockImplementationOnce(() => Promise.reject(new Error()));
    try {
      await fetchData({ url: 'test/api', data: 'data', method: 'post', headers: 'header' });
    } catch (er) {
      expect(stopLoader).toHaveBeenCalled();
      expect(showError).toHaveBeenCalled();
    }
  });
});
