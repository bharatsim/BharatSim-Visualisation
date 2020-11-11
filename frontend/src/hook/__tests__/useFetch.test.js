import { renderHook } from '@testing-library/react-hooks';

import useFetch from '../useFetch';

describe('Use fetch hook', () => {
  let api;
  beforeEach(() => {
    api = jest.fn().mockImplementation(async () => Promise.resolve('Hello NewUserHomeScreen'));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return fetch data for given url', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFetch(api));

    await waitForNextUpdate();

    expect(result.current.data).toEqual('Hello NewUserHomeScreen');
    expect(api).toHaveBeenCalledWith();
  });

  it('should return fetch data for given url and other data ', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch(api, ['data', 'params', 'query']),
    );

    await waitForNextUpdate();

    expect(result.current.data).toEqual('Hello NewUserHomeScreen');
    expect(api).toHaveBeenCalledWith('data', 'params', 'query');
  });
});
