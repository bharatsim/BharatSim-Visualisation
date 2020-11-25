import { useState } from 'react';

export const loaderStates = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

function useLoader(defaultLoadingState = '') {
  const [loadingState, setLoadingState] = useState({ state: defaultLoadingState, message: '' });

  function startLoader(message) {
    setLoadingState({ state: loaderStates.LOADING, message });
  }

  function stopLoaderAfterSuccess(message) {
    setLoadingState({ state: loaderStates.SUCCESS, message });
  }

  function stopLoaderAfterError(message) {
    setLoadingState({ state: loaderStates.ERROR, message });
  }

  function resetLoader() {
    setLoadingState({ state: defaultLoadingState, message: '' });
  }

  return {
    loadingState: loadingState.state,
    message: loadingState.message,
    startLoader,
    stopLoaderAfterSuccess,
    stopLoaderAfterError,
    resetLoader,
  };
}

export default useLoader;
