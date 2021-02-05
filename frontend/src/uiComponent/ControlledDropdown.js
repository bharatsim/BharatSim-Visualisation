import React from 'react';
import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';
import Dropdown from './Dropdown';

function ControlledDropDown({
  control,
  name,
  validations,
  options,
  label,
  id,
  multiple,
  disabled,
  error,
  defaultValue,
}) {
  const {
    field: { ref, onChange, value },
  } = useController({
    name,
    control,
    rules: validations,
    defaultValue,
  });

  return (
    <Dropdown
      onChange={onChange}
      value={value}
      error={error.type ? error.message || ' ' : ''}
      inputRef={ref}
      options={options}
      label={label}
      id={id}
      multiple={multiple}
      disabled={disabled}
    />
  );
}

ControlledDropDown.defaultProps = {
  defaultValue: '',
  error: {},
  multiple: false,
  disabled: false,
  validations: {},
};

const valuePropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({}),
  PropTypes.number,
  PropTypes.array,
]);

ControlledDropDown.propTypes = {
  control: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  validations: PropTypes.shape({}),
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: valuePropType.isRequired,
      displayName: PropTypes.string.isRequired,
    }),
  ).isRequired,
  id: PropTypes.string.isRequired,
  error: PropTypes.shape({
    type: PropTypes.string,
    message: PropTypes.string,
  }),
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ControlledDropDown;
