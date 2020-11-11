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

  afterEach(() => {
    jest.clearAllMocks();
  });

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
      expect(showError).toHaveBeenCalledWith({
        errorMessage: 'Failed to load page',
        errorModalButtonText: 'Reload',
        errorTitle: 'Error due to technical error at server',
        helperText: 'Try to reload the page',
        onErrorModalButtonClick: expect.anything(Function),
      });
    }
  });

  it('should call show error with 404 as error code if api return address not found error', async () => {
    axios.mockImplementationOnce(() =>
      Promise.reject({ response: { status: 404, data: { errorCode: '1001' } } }),
    );
    try {
      await fetchData({ something: 'bad' });
    } catch (err) {
      expect(showError).toHaveBeenCalledWith({
        errorMessage: 'Something is wrong in url',
        errorModalButtonText: 'Go to Home',
        errorTitle: 'Aw Snap! Address not found',
        helperText: 'Check url is correct or not',
        onErrorModalButtonClick: expect.anything(Function),
      });
    }
  });

  it('should call show error with 504 as error code if api return gateway timeout error', async () => {
    axios.mockImplementationOnce(() =>
      Promise.reject({ response: { status: 504, data: { errorCode: '1001' } } }),
    );
    try {
      await fetchData({ something: 'bad' });
    } catch (err) {
      expect(showError).toHaveBeenCalledWith({
        errorMessage: 'Server is down',
        errorModalButtonText: 'Reload',
        errorTitle: 'Aw Snap! Server is down',
        helperText: 'Try again after some time',
        onErrorModalButtonClick: expect.anything(Function),
      });
    }
  });

  it('should call show error with NETWORK_ERROR as error code if api return no internet error', async () => {
    axios.mockImplementationOnce(() => Promise.reject({}));
    try {
      await fetchData({ something: 'bad' });
    } catch (err) {
      expect(showError).toHaveBeenCalledWith({
        errorMessage: 'No internet connection',
        errorModalButtonText: 'Reload',
        errorTitle: 'Aw Snap! Your Internet connection is lost',
        helperText: 'Connect to internet',
        onErrorModalButtonClick: expect.anything(),
      });
    }
  });

  it('should call show error with Default error as error code if api return any other error', async () => {
    axios.mockImplementationOnce(() =>
      Promise.reject({ response: { status: 400, data: { errorCode: '1001' } } }),
    );
    try {
      await fetchData({ something: 'bad' });
    } catch (err) {
      expect(showError).toHaveBeenCalledWith({
        errorMessage: 'Something went wrong',
        errorModalButtonText: 'Reload',
        errorTitle: 'Error while loading the page',
        helperText: 'Try to reload the page',
        onErrorModalButtonClick: expect.anything(),
      });
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

  it('should return error after any error while fetching if custom error handler true', async () => {
    axios.mockImplementationOnce(() => Promise.reject('error message'));
    try {
      await fetchData({
        url: 'test/api',
        data: 'data',
        method: 'post',
        headers: 'header',
        isCustomErrorHandler: true,
      });
    } catch (error) {
      expect(error).toEqual('error message');
    }
  });
});
