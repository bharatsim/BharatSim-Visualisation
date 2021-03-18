import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import Dropdown from '../Dropdown';

function SelectField({
  name,
  options,
  label,
  id,
  multiple,
  disabled,
  helperText,
  validate,
  defaultValue,
}) {
  return (
    <Field
      name={name}
      validate={validate}
      defaultValue={defaultValue}
      render={({ input, meta }) => {
        return (
          <Dropdown
            onChange={input.onChange}
            value={input.value || ''}
            error={meta.touched && meta.error ? meta.error : ''}
            options={options}
            label={label}
            id={id}
            multiple={multiple}
            disabled={disabled}
            helperText={helperText}
          />
        );
      }}
    />
  );
}

SelectField.defaultProps = {
  multiple: false,
  disabled: false,
  helperText: '',
  validate: null,
  defaultValue: '',
};

const valuePropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({}),
  PropTypes.number,
  PropTypes.array,
]);

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  defaultValue: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: valuePropType.isRequired,
      displayName: PropTypes.string.isRequired,
    }),
  ).isRequired,
  id: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  validate: PropTypes.func,
};

export default SelectField;
