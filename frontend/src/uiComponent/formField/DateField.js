import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import { KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import { DATE_FORMAT } from '../../constants/annotations';

const useStyles = makeStyles((theme) => ({
  helperText: {
    margin: theme.spacing(1, 0, 0, 0),
  },
  inputField: {
    padding: theme.spacing(4),
    backgroundColor: theme.colors.grayScale['100'],
    borderRadius: theme.spacing(1),
  },
  input: {
    width: theme.spacing(52),
  },
}));

function DateField({ name, label, dataTestId, validate, defaultValue, format, helperText }) {
  const classes = useStyles();

  return (
    <Field
      name={name}
      validate={validate}
      defaultValue={defaultValue}
      render={({ input: { value, onChange, ...rest }, meta }) => (
        <KeyboardDatePicker
          label={label}
          inputVariant="filled"
          value={value || defaultValue}
          onChange={(date) => onChange(date)}
          {...rest}
          inputProps={{ 'data-testid': dataTestId }}
          FormHelperTextProps={{ classes: { root: classes.helperText } }}
          classes={{ root: classes.input }}
          format={format}
          helperText={meta.error ? meta.error : helperText}
          error={meta.error}
        />
      )}
    />
  );
}

DateField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  dataTestId: PropTypes.string.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.shape({})]),
  validate: PropTypes.func,
  format: PropTypes.string,
  helperText: PropTypes.string,
};

DateField.defaultProps = {
  label: '',
  defaultValue: '',
  validate: null,
  format: DATE_FORMAT,
  helperText: '',
};

export default DateField;
