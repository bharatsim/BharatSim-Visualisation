/* eslint-disable react/jsx-no-duplicate-props */
import MuiTextField from '@material-ui/core/TextField';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Field } from 'react-final-form';

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
    input: {
      minWidth: theme.spacing(52),
    },
  };
});

function TextField({
  name,
  type,
  helperText,
  fullWidth,
  label,
  dataTestId,
  inputProps,
  defaultValue,
  validate,
  InputProps,
  ...rest
}) {
  const classes = useStyles();

  return (
    <Field
      name={name}
      validate={validate}
      defaultValue={defaultValue}
      render={({ input: { value, ...inputRest }, meta }) => (
        <MuiTextField
          name={name}
          label={label}
          helperText={meta.error && meta.touched ? meta.error : helperText}
          error={meta.error && meta.touched}
          variant="filled"
          type={type}
          fullWidth={fullWidth}
          value={value}
          {...inputRest}
          inputProps={{ 'data-testid': dataTestId, ...inputProps }}
          InputProps={{ ...InputProps }}
          FormHelperTextProps={{ classes: { root: classes.helperText } }}
          classes={{ root: classes.input }}
          {...rest}
        />
      )}
    />
  );
}

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  helperText: PropTypes.string,
  label: PropTypes.string,
  dataTestId: PropTypes.string.isRequired,
  fullWidth: PropTypes.bool,
  inputProps: PropTypes.shape({}),
  InputProps: PropTypes.shape({}),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.shape({})]),
  validate: PropTypes.func,
};

TextField.defaultProps = {
  fullWidth: false,
  helperText: '',
  type: 'text',
  label: '',
  inputProps: {},
  InputProps: {},
  defaultValue: '',
  validate: null,
};

export default TextField;
