import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import AppRoute from './AppRoute';
import withThemeProvider from './theme/withThemeProvider';
import withAppLayout from './modules/layout/appLayout/withAppLayout';
import withSnackBar from './hoc/withSnackBar';
import withOverlayLoaderOrError from './hoc/withOverlayLoaderOrError';
import { initLoader } from './utils/fetch';
import { overlayLoaderOrErrorContext } from './contexts/overlayLoaderOrErrorContext';
import { initHistory } from './utils/browserHistory';

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
  const { stopLoader, startLoader, showError } = useContext(overlayLoaderOrErrorContext);
  const History = useHistory();
  initLoader(startLoader, stopLoader, showError);
  initHistory(History);

  return (
    <div className={classes.root}>
      <AppRoute />
    </div>
  );
}

export default withThemeProvider(withSnackBar(withOverlayLoaderOrError(withAppLayout(App))));
