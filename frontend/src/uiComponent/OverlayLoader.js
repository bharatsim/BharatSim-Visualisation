import { CircularProgress } from '@material-ui/core';
import React from 'react';
import Dialog from '@material-ui/core/Dialog';

function OverlayLoader({ isLoading }) {
  return (
    <Dialog open={isLoading}>
      <CircularProgress />
    </Dialog>
  );
}

export default OverlayLoader;
