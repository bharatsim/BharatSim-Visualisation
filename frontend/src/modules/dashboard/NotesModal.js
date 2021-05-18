import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Popover } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Notes from '../../uiComponent/Notes';

const useStyles = makeStyles(() => ({
  button: {
    position: 'fixed',
    bottom: 32,
    right: 32,
  },
}));

function NotesModal({ text, saveNotes }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const toggle = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeModal = () => {
    setAnchorEl(null);
  };

  const isOpen = Boolean(anchorEl);
  return (
    <>
      <Box className={classes.button}>
        <Button endIcon={<ArrowDropDown />} onClick={toggle} variant="contained" color="primary">
          Insights
        </Button>
      </Box>
      <Popover
        open={isOpen}
        onClose={closeModal}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Notes onBlur={saveNotes} text={text} />
      </Popover>
    </>
  );
}

NotesModal.defaultProps = {
  text: '',
};

NotesModal.propTypes = {
  text: PropTypes.string,
  saveNotes: PropTypes.func.isRequired,
};

export default NotesModal;
