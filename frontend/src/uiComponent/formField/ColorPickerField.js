import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field, useForm } from 'react-final-form';

import ColorPicker from '../ColorPicker';

function ColorPickerField({ name, defaultValue }) {
  const { change, getFieldState } = useForm();
  const value = getFieldState(name)?.value;

  useEffect(() => {
    if (!value) {
      change(name, defaultValue);
    }
  }, [!!value]);

  return (
    <Field
      name={name}
      render={({ input }) => (
        <ColorPicker
          onChange={input.onChange}
          value={input.value || defaultValue}
          dataTestId="color-picker"
        />
      )}
    />
  );
}

ColorPickerField.defaultProps = {
  defaultValue: {
    r: '241',
    g: '112',
    b: '19',
    a: '1',
  },
};

ColorPickerField.propTypes = {
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.shape({}),
};

export default ColorPickerField;
