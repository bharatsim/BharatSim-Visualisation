import React from 'react';
import PropTypes from 'prop-types';

import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ErrorBar from '../../uiComponent/ErrorBar';

const styles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    height: '100%',
    minHeight: '100px',
    justifyContent: 'center',
  },
}));

function Error({ errorAction, message, fullWidth }) {
  const classes = styles();
  return (
    <Box className={classes.root}>
      <ErrorBar errorAction={errorAction} message={message} visible fullWidth={fullWidth} />
    </Box>
  );
}

Error.defaultProps = {
  message: 'Unable to fetch',
  errorAction: null,
  fullWidth: false,
};

Error.propTypes = {
  message: PropTypes.string,
  fullWidth: PropTypes.bool,
  errorAction: PropTypes.shape({
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
};

export default Error;
