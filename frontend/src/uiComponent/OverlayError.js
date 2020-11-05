import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

function OverlayError({ isError, onClose }) {
  return (
    <Dialog open={isError}>
      <Button onClick={onClose}>Close</Button>
      Error message
    </Dialog>
  );
}

export default OverlayError;
