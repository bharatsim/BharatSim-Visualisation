import React from 'react';
import PropTypes from 'prop-types';

import { Button, fade } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ChildrenPropTypes } from '../commanPropTypes';

const useErrorButtonStyle = makeStyles((theme) => ({
  text: {
    boxShadow: 'unset',
    color: theme.palette.error.dark,
    ...theme.typography.body1,
    '&:hover': {
      backgroundColor: fade(theme.palette.error.light, 0.2),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.error.light, 0.2),
    },
    '&$disabled': {
      color: theme.palette.text.disabled,
    },
  },
  contained: {
    boxShadow: 'unset',
    color: theme.colors.button.color,
    backgroundColor: theme.palette.error.dark,
    '&:focus': {
      backgroundColor: fade(theme.palette.error.dark, 0.8),
    },
    '&:hover': {
      backgroundColor: fade(theme.palette.error.dark, 0.8),
    },
    '&$disabled': {
      color: theme.palette.text.disabled,
      backgroundColor: theme.colors.grayScale['100'],
    },
  },
  disabled: {},
}));

function ErrorButton({ variant, size, onClick, classes, children, ...rest }) {
  const buttonClasses = useErrorButtonStyle();
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      classes={{ ...buttonClasses, ...classes }}
      {...rest}
    >
      {children}
    </Button>
  );
}

ErrorButton.defaultProps = {
  variant: 'text',
  size: 'medium',
  classes: {},
};

ErrorButton.propTypes = {
  variant: PropTypes.string,
  size: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
  children: ChildrenPropTypes.isRequired,
};

export default ErrorButton;
