import React from 'react';
import PropTypes from 'prop-types';

import { SketchPicker } from 'react-color';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Popover, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  colorBox: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    borderRadius: theme.spacing(1),
    background: (color) => `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
  },
  swatch: {
    padding: '5px',
    background: '#fff',
    borderRadius: '1px',
    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    display: 'inline-block',
    cursor: 'pointer',
  },
  popover: {
    position: 'absolute',
    zIndex: '2',
  },
  cover: {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
  },
}));

function ColorPicker({ onChange, value }) {
  const classes = useStyles(value);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (selectedColor) => {
    onChange(selectedColor.rgb);
  };

  const open = Boolean(anchorEl);

  return (
    <Box className={classes.container}>
      <Typography variant="subtitle2">Color</Typography>
      <Box className={classes.colorBox} onClick={handleClick} ml={2} data-testid="color-picker" />
      <Popover
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <SketchPicker color={value} onChange={handleChange} />
      </Popover>
    </Box>
  );
}

ColorPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({}).isRequired,
};

export default ColorPicker;
