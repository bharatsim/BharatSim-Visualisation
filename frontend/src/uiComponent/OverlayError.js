import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ErrorBar from './ErrorBar';

const useStyles = makeStyles((theme) => {
  return {
    errContainer: {
      maxWidth: theme.spacing(150),
      minWidth: theme.spacing(100),
      padding: theme.spacing(6),
    },

    errorTitle: {},
    errorMessage: {
      lineHeight: 1,
      color: theme.palette.error.dark,
    },
    errorBox: {
      display: 'flex',
    },
    errorActions: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
  };
});

function OverlayError({ isError, errorMessages, onClose }) {
  const classes = useStyles();
  return (
    <Dialog open={isError}>
      <Box className={classes.errContainer}>
        <Box className={classes.errorTitle} mb={3}>
          <Typography variant="subtitle2">{errorMessages.errorTitle}</Typography>
        </Box>

        <ErrorBar message={errorMessages.errorMessage} visible />
        <Box mt={4}>
          <Typography variant="body2"> {errorMessages.helperText} </Typography>
        </Box>

        <Box className={classes.errorActions}>
          <Button onClick={onClose} variant="outlined">
            Okay
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

OverlayError.propTypes = {
  isError: PropTypes.bool.isRequired,
  errorMessages: PropTypes.shape({
    errorTitle: PropTypes.string.isRequired,
    errorMessage: PropTypes.string.isRequired,
    helperText: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OverlayError;
