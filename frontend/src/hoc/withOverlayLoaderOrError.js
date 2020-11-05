import React, { useState } from 'react';
import { OverlayLoaderContextProvider } from '../contexts/overlayLoaderContext';
import OverlayLoader from '../uiComponent/OverlayLoader';
import OverlayError from '../uiComponent/OverlayError';

function withOverlayLoaderOrError(WrappedComponent) {
  return (props) => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    function startLoader() {
      setLoading(true);
    }

    function stopLoader() {
      setLoading(false);
    }

    function showError() {
      setError(true);
    }

    function hideError() {
      setError(false);
    }

    return (
      <OverlayLoaderContextProvider value={{ stopLoader, startLoader, showError }}>
        <WrappedComponent {...props} />
        {isLoading && <OverlayLoader isLoading={isLoading} />}
        {error && <OverlayError isError={error} onClose={hideError} />}
      </OverlayLoaderContextProvider>
    );
  };
}

export default withOverlayLoaderOrError;
