import React, { useState } from 'react';
import { OverlayLoaderOrErrorContextProvider } from '../contexts/overlayLoaderOrErrorContext';
import OverlayLoader from '../uiComponent/OverlayLoader';
import OverlayError from '../uiComponent/OverlayError';

function withOverlayLoaderOrError(WrappedComponent) {
  return (props) => {
    const [loader, setLoader] = useState({ loadersCount: 0 });
    const [error, setError] = useState({
      isError: false,
      errorConfigs: null,
    });

    function startLoader() {
      setLoader((prevState) => ({
        loadersCount: prevState.loadersCount + 1,
      }));
    }

    function stopLoader() {
      setLoader((prevState) => {
        if (prevState.loadersCount === 0) {
          return { loadersCount: 0 };
        }
        return { loadersCount: prevState.loadersCount - 1 };
      });
    }

    function stopAllLoaders() {
      setLoader({ loadersCount: 0, message: '' });
    }

    function showError(errorConfigs) {
      stopAllLoaders();
      setError({ isError: true, errorConfigs });
    }

    function hideError() {
      setError({ isError: false, errorConfigs: null });
    }
    return (
      <OverlayLoaderOrErrorContextProvider value={{ stopLoader, startLoader, showError }}>
        <WrappedComponent {...props} />
        {loader.loadersCount >= 1 && <OverlayLoader isLoading={loader.loadersCount >= 1} />}
        {error.isError && (
          <OverlayError
            isError={error.isError}
            errorConfig={error.errorConfigs}
            hideError={hideError}
            data={error.data}
          />
        )}
      </OverlayLoaderOrErrorContextProvider>
    );
  };
}

export default withOverlayLoaderOrError;
