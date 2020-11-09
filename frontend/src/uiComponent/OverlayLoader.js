import { CircularProgress } from '@material-ui/core';
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => {
  return {
    loaderContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(9),
      minWidth: theme.spacing(70),
      justifyContent: 'center',
    },
  };
});
function OverlayLoader({ isLoading, loadingMessage }) {
  const classes = useStyles();
  return (
    <Dialog open={isLoading} transitionDuration={0}>
      <Box className={classes.loaderContainer}>
        <CircularProgress />
        <Box ml={3}>
          <Typography variant="body2">{loadingMessage}</Typography>
        </Box>
      </Box>
    </Dialog>
  );
}
OverlayLoader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  loadingMessage: PropTypes.string.isRequired,
};

export default OverlayLoader;
