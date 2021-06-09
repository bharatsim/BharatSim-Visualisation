import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    textAlign: 'center',
    cursor: 'pointer',
    width: theme.spacing(16),
    // color: (isSelected) => {
    //   return isSelected ? theme.palette.text.primary : theme.palette.text.secondary;
    // },
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: theme.spacing(16),
    width: theme.spacing(16),
    borderColor: theme.colors.grayScale['100'],
    border: '1px solid',
  },
  selectedImageContainer: {
    borderColor: theme.colors.primaryColorScale['500'],
    backgroundColor: theme.colors.primaryColorScale['50'],
    boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.3)',
  },
}));

function ImageOption({ icon, label, value, onCLick, dataTestId }) {
  const classes = useStyles();

  function onImageOptionClick() {
    onCLick(value);
  }

  return (
    <Box className={classes.buttonContainer} onClick={onImageOptionClick} data-testid={dataTestId}>
      <Box className={classes.imageContainer}>{icon}</Box>
      <Typography variant="caption">{label}</Typography>
    </Box>
  );
}

ImageOption.defaultProps = {
  dataTestId: '',
};

ImageOption.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCLick: PropTypes.func.isRequired,
  dataTestId: PropTypes.string,
};

export default ImageOption;
