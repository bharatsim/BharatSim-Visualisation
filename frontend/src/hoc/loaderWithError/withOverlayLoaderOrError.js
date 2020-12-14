import React, { useState } from 'react';
import { OverlayLoaderOrErrorContextProvider } from '../../contexts/overlayLoaderOrErrorContext';
import OverlayLoader from '../../uiComponent/OverlayLoader';
import OverlayError from '../../uiComponent/OverlayError';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "./actions";

function withOverlayLoaderOrError(WrappedComponent) {
  return (props) => {
    const loaderCount = useSelector((state)=> state.loaderOrError.loaderCount)
    const isError =  useSelector((state)=> state.loaderOrError.isError)
    const errorConfig =  useSelector((state)=> state.loaderOrError.errorConfig)

    const dispatch =  useDispatch()
    function startLoader() {
      dispatch(actions.startLoader())
    }

    function stopLoader() {
      dispatch(actions.stopLoader())
    }

    function showError(errorConfigs) {
      dispatch(actions.showErrors(errorConfigs))
    }

    function hideError() {
      dispatch(actions.hideErrors())
    }
    return (
      <OverlayLoaderOrErrorContextProvider value={{ stopLoader, startLoader, showError }}>
        <WrappedComponent {...props} />
        {loaderCount >= 1 && <OverlayLoader isLoading={loaderCount >= 1} />}
        {isError && (
          <OverlayError
            isError={isError}
            errorConfig={errorConfig}
            hideError={hideError}
          />
        )}
      </OverlayLoaderOrErrorContextProvider>
    );
  };
}

export default withOverlayLoaderOrError;
