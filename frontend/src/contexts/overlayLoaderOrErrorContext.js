import React from 'react';

const overlayLoaderOrErrorContext = React.createContext({
  stopLoader: null,
  startLoader: null,
  showError: null,
  isLoading: false,
});

const OverlayLoaderOrErrorContextProvider = overlayLoaderOrErrorContext.Provider;

export { overlayLoaderOrErrorContext, OverlayLoaderOrErrorContextProvider };
