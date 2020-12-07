import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import MuiDialogContent from '@material-ui/core/DialogContent';
import ErrorButton from './ErrorButton';
import { DialogActions, DialogTitle } from './Modal';

const dialogStyles = makeStyles((theme) => ({
  paper: {
    width: theme.spacing(121),
  },
}));
const DialogContent = withStyles((theme) => ({
  root: {
    margin: theme.spacing(0, 4),
    padding: theme.spacing(0, 0, 4, 0),
  },
}))(MuiDialogContent);

function DeleteConfirmationModal({ open, handleClose, title, children, deleteAction }) {
  const dialogClasses = dialogStyles();
  const { onDelete, name, dataTestId } = deleteAction;
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      classes={dialogClasses}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Box px={2}>{children}</Box>
      </DialogContent>

      <DialogActions>
        <ErrorButton data-testid={dataTestId} autoFocus onClick={onDelete} variant="contained">
          {name}
        </ErrorButton>
      </DialogActions>
    </Dialog>
  );
}

DeleteConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  deleteAction: PropTypes.shape({
    name: PropTypes.string.isRequired,
    dataTestId: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
  }).isRequired,
};

export default DeleteConfirmationModal;
