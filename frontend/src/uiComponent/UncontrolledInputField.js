/* eslint-disable react/jsx-no-duplicate-props */

import TextField from '@material-ui/core/TextField';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  return {
    helperText: {
      margin: theme.spacing(1, 0, 0, 0),
    },
    inputField: {
      padding: theme.spacing(4),
      backgroundColor: theme.colors.grayScale['100'],
      borderRadius: theme.spacing(1),
    },
  };
});

function UncontrolledInputTextField({
  name,
  register,
  type,
  error,
  helperText,
  fullWidth,
  defaultValue,
  label,
  validations,
  dataTestid,
}) {
  const classes = useStyles();
  return (
    <TextField
      name={name}
      helperText={error.type ? error.message || ' ' : helperText}
      error={!!error.type}
      variant="filled"
      inputRef={register(validations)}
      type={type}
      fullWidth={fullWidth}
      InputProps={{
        classes: label ? {} : { input: classes.inputField },
      }}
      inputProps={{ 'data-testid': dataTestid }}
      FormHelperTextProps={{ classes: { root: classes.helperText } }}
      defaultValue={defaultValue}
      label={label}
    />
  );
}

UncontrolledInputTextField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  register: PropTypes.func.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  helperText: PropTypes.string,
  error: PropTypes.shape({ type: PropTypes.string, message: PropTypes.string }),
  label: PropTypes.string,
  dataTestid: PropTypes.string.isRequired,
  fullWidth: PropTypes.bool,
  validations: PropTypes.shape({}),
};

UncontrolledInputTextField.defaultProps = {
  fullWidth: false,
  error: {},
  helperText: '',
  type: 'text',
  label: '',
  validations: {},
};

export default UncontrolledInputTextField;
