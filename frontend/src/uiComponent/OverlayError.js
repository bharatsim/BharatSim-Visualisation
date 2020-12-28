import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
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

function OverlayError({ isError, errorConfig, hideError }) {
  const classes = useStyles();
  const {
    errorMessage,
    errorTitle,
    helperText,
    errorModalButtonText,
    onErrorModalButtonClick,
  } = errorConfig;

  function onErrorActionClick() {
    hideError();
    onErrorModalButtonClick();
  }

  return (
    <Dialog open={isError}>
      <Box className={classes.errContainer}>
        <Box
          className={classes.errorTitle}
          mb={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle2">{errorTitle}</Typography>
          <IconButton
            aria-label="close"
            data-testid="button-icon-close"
            className={classes.closeButton}
            onClick={hideError}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <ErrorBar message={errorMessage} visible />
        <Box mt={4}>
          <Typography variant="body2">{helperText}</Typography>
        </Box>

        <Box className={classes.errorActions}>
          <Button onClick={onErrorActionClick} variant="outlined">
            {errorModalButtonText}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

OverlayError.propTypes = {
  isError: PropTypes.bool.isRequired,
  errorConfig: PropTypes.shape({
    errorMessage: PropTypes.string.isRequired,
    errorTitle: PropTypes.string.isRequired,
    helperText: PropTypes.string.isRequired,
    errorModalButtonText: PropTypes.string.isRequired,
    onErrorModalButtonClick: PropTypes.func.isRequired,
  }).isRequired,
  hideError: PropTypes.func.isRequired,
};

export default OverlayError;
