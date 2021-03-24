import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import { KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import { DATE_FORMAT } from '../../constants/annotations';

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
      width: theme.spacing(52),
    },
  };
});

function DateField({ name, label, dataTestId, validate, defaultValue, format }) {
  const classes = useStyles();

  return (
    <Field
      name={name}
      validate={validate}
      defaultValue={defaultValue}
      render={({ input }) => (
        <KeyboardDatePicker
          label={label}
          inputVariant="filled"
          value={input.value || defaultValue}
          onChange={(date) => input.onChange(date)}
          inputProps={{ 'data-testid': dataTestId }}
          FormHelperTextProps={{ classes: { root: classes.helperText } }}
          classes={{ root: classes.input }}
          format={format}
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
  isEditMode: PropTypes.bool,
  format: PropTypes.string,
};

DateField.defaultProps = {
  label: '',
  defaultValue: '',
  validate: null,
  isEditMode: false,
  format: DATE_FORMAT,
};

export default DateField;
