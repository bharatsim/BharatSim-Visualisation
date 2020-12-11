import { CircularProgress } from '@material-ui/core';
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => {
  return {
    loaderContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(9),
      minWidth: theme.spacing(70),
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    root: {
      backgroundColor: 'transparent',
    },
  };
});
function OverlayLoader({ isLoading }) {
  const classes = useStyles();
  return (
    <Dialog open={isLoading} transitionDuration={0} classes={{ root: classes.root }}>
      <CircularProgress />
    </Dialog>
  );
}
OverlayLoader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default OverlayLoader;
