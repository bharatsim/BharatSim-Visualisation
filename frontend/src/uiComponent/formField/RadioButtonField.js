import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Field } from 'react-final-form';

const useStyles = makeStyles(() => ({
  vertical: {
    display: 'flex',
    flexDirection: 'column',
  },
  horizontal: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

function RadioButtonsField({ options, name, vertical, disabled, defaultValue, validate }) {
  const classes = useStyles();
  return (
    <FormControl disabled={disabled}>
      <Box className={vertical ? classes.vertical : classes.horizontal}>
        {options.map((option) => (
          <FormControlLabel
            value={option.value}
            label={option.label}
            key={`option-${option.value}`}
            name={name}
            control={
              <Field
                name={name}
                type="radio"
                validate={validate}
                defaultValue={defaultValue}
                render={({
                  input: { name: inputName, value, onChange, checked, ...restInput },
                }) => (
                  <Radio
                    name={inputName}
                    size="small"
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    inputProps={{ ...restInput }}
                  />
                )}
              />
            }
          />
        ))}
      </Box>
    </FormControl>
  );
}

RadioButtonsField.defaultProps = {
  vertical: true,
  disabled: false,
  validate: null,
};

RadioButtonsField.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  name: PropTypes.string.isRequired,
  vertical: PropTypes.bool,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.string.isRequired,
  validate: PropTypes.func,
};

export default RadioButtonsField;
