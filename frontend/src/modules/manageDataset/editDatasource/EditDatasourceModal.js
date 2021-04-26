import React from 'react';
import Modal from '../../../uiComponent/Modal';
import CustomColumnBuilder from './CustomColumnBuilder';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '80vw',
    height: `calc(90vh - ${theme.spacing(20)}px)`,
  },
}));

function EditDataSourceModal({ open, handleClose, selectedRow }) {
  const classes = useStyles();
  return (
    <Modal open={open} handleClose={handleClose} title="Custom Column">
      <Box className={classes.container}>
        <CustomColumnBuilder />
      </Box>
    </Modal>
  );
}

export default EditDataSourceModal;
