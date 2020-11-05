import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import AppRoute from './AppRoute';
import withThemeProvider from './theme/withThemeProvider';
import withAppLayout from './modules/layout/appLayout/withAppLayout';
import withSnackBar from './hoc/withSnackBar';
import withOverlayLoaderOrError from './hoc/withOverlayLoaderOrError';
import { initLoader } from './utils/fetch';
import { overlayLoaderContext } from './contexts/overlayLoaderContext';

const useRootStyles = makeStyles(() => ({
  root: {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
}));

function App() {
  const classes = useRootStyles();
  const { stopLoader, startLoader, showError } = useContext(overlayLoaderContext);
  initLoader(startLoader, stopLoader, showError);

  return (
    <div className={classes.root}>
      <AppRoute />
    </div>
  );
}

export default withThemeProvider(withSnackBar(withOverlayLoaderOrError(withAppLayout(App))));
