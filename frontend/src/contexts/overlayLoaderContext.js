import React from 'react';

const overlayLoaderContext = React.createContext({
  stopLoader: null,
  startLoader: null,
  showError: null,
  isLoading: false,
});

const OverlayLoaderContextProvider = overlayLoaderContext.Provider;

export { overlayLoaderContext, OverlayLoaderContextProvider };
