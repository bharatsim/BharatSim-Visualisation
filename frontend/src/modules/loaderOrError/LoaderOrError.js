import React from 'react';
import PropTypes from 'prop-types';
import { loaderStates } from '../../hook/useLoader';
import Loader from './Loader';
import Error from './Error';
import { ChildrenPropTypes } from '../../commanPropTypes';

export default function LoaderOrError({
  children,
  loadingState,
  snackbar,
  message,
  errorAction,
  fullWidth,
}) {
  if (snackbar && (loadingState === loaderStates.ERROR || loadingState === loaderStates.SUCCESS)) {
    return children;
  }
  if (loadingState === loaderStates.SUCCESS) {
    return children;
  }
  if (loadingState === loaderStates.ERROR) {
    return <Error errorAction={errorAction} message={message} fullWidth={fullWidth} />;
  }
  return <Loader />;
}

LoaderOrError.defaultProps = {
  snackbar: false,
  message: '',
  errorAction: null,
  fullWidth: false,
};

LoaderOrError.propTypes = {
  children: ChildrenPropTypes.isRequired,
  fullWidth: PropTypes.bool,
  loadingState: PropTypes.oneOf(['', ...Object.values(loaderStates)]).isRequired,
  snackbar: PropTypes.bool,
  message: PropTypes.string,
  errorAction: PropTypes.shape({}),
};
