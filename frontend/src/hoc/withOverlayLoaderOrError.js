import React, { useState } from 'react';
import { OverlayLoaderContextProvider } from '../contexts/overlayLoaderContext';
import OverlayLoader from '../uiComponent/OverlayLoader';
import OverlayError from '../uiComponent/OverlayError';
import { errorTypes } from '../constants/loaderAndErrorMessages';

function withOverlayLoaderOrError(WrappedComponent) {
  return (props) => {
    const [loader, setLoader] = useState({ loadersCount: 0 });
    const [error, setError] = useState({
      isError: false,
      errorCode: errorTypes.DEFAULT,
      data: undefined,
      query: undefined,
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

    function showError(errorCode) {
      stopAllLoaders();
      setError({ isError: true, errorCode });
    }

    function hideError() {
      setError({ isError: false, errorCode: errorTypes.DEFAULT });
    }

    return (
      <OverlayLoaderContextProvider value={{ stopLoader, startLoader, showError }}>
        <WrappedComponent {...props} />
        {loader.loadersCount >= 1 && <OverlayLoader isLoading={loader.loadersCount >= 1} />}
        {error.isError && (
          <OverlayError
            isError={error.isError}
            errorCode={error.errorCode}
            onClose={hideError}
            data={error.data}
          />
        )}
      </OverlayLoaderContextProvider>
    );
  };
}

export default withOverlayLoaderOrError;
