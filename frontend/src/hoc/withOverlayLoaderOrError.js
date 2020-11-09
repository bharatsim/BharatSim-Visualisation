import React, { useState } from 'react';
import { OverlayLoaderContextProvider } from '../contexts/overlayLoaderContext';
import OverlayLoader from '../uiComponent/OverlayLoader';
import OverlayError from '../uiComponent/OverlayError';

function withOverlayLoaderOrError(WrappedComponent) {
  return (props) => {
    const [loader, setLoader] = useState({ loadersCount: 0, message: '' });
    const [error, setError] = useState({ isError: false, messages: {} });

    function startLoader(message) {
      setLoader((prevState) => ({
        loadersCount: prevState.loadersCount + 1,
        message,
      }));
    }

    function stopLoader() {
      setLoader((prevState) => {
        if (prevState.loadersCount === 0) {
          return { loadersCount: 0, message: prevState.message };
        }
        return { loadersCount: prevState.loadersCount - 1, message: prevState.message };
      });
    }

    function stopAllLoaders() {
      setLoader({ loadersCount: 0, message: '' });
    }

    function showError(errorMessage) {
      stopAllLoaders();
      setError({ isError: true, messages: errorMessage });
    }

    function hideError() {
      setError({ isError: false, messages: {} });
    }

    return (
      <OverlayLoaderContextProvider value={{ stopLoader, startLoader, showError }}>
        <WrappedComponent {...props} />
        {loader.loadersCount >= 1 && (
          <OverlayLoader isLoading={loader.loadersCount >= 1} loadingMessage={loader.message} />
        )}
        {error.isError && (
          <OverlayError
            isError={error.isError}
            errorMessages={error.messages}
            onClose={hideError}
          />
        )}
      </OverlayLoaderContextProvider>
    );
  };
}

export default withOverlayLoaderOrError;
