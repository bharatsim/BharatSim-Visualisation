import Box from '@material-ui/core/Box';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ErrorButton from './ErrorButton';

const useStyles = makeStyles((theme) => ({
  errorTitle: {
    fontWeight: theme.typography.fontWeightBold,
    lineHeight: 1,
    color: theme.palette.error.dark,
  },
  errorMessage: {
    lineHeight: 1,
    color: theme.palette.error.dark,
  },
  hidden: {
    visibility: 'hidden',
    height: theme.spacing(8),
  },
  errorBox: {
    display: 'flex',
    minHeight: theme.spacing(8),
    border: '1px solid',
    borderRadius: theme.spacing(1),
    borderColor: '#FFC5B3',
    backgroundColor: '#FFEEE8',
    padding: theme.spacing(2, 6),
    justifyContent: 'space-between',
    alignItems: 'center',
    width: ({ fullWidth }) => (fullWidth ? '100%' : 'fit-content'),
  },
}));

function ErrorBar({ visible, message, errorAction, fullWidth }) {
  const classes = useStyles({ fullWidth });
  return (
    <Box className={visible ? classes.errorBox : classes.hidden}>
      <Box display="flex">
        <Typography variant="body2" color="error" classes={{ body2: classes.errorTitle }}>
          Error:&nbsp;
        </Typography>
        <Typography variant="body2" color="error" classes={{ body2: classes.errorMessage }}>
          {message}
        </Typography>
      </Box>
      {errorAction && (
        <Box ml={7}>
          <ErrorButton onClick={errorAction.onClick} size="small" variant="text">
            {errorAction.name}
          </ErrorButton>
        </Box>
      )}
    </Box>
  );
}

ErrorBar.propTypes = {
  visible: PropTypes.bool,
  message: PropTypes.string,
  fullWidth: PropTypes.bool,
  errorAction: PropTypes.shape({
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
};
ErrorBar.defaultProps = {
  visible: false,
  message: '',
  errorAction: null,
  fullWidth: true,
};
export default ErrorBar;
