import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import { useController } from 'react-hook-form';
import Radio from '@material-ui/core/Radio';
import PropTypes from 'prop-types';

function RadioButtons({ options, control, name, defaultValue }) {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
    defaultValue,
  });
  return (
    <FormControl>
      <RadioGroup value={value} onChange={onChange}>
        {options.map((option) => {
          return (
            <FormControlLabel
              value={option.value}
              control={<Radio />}
              label={option.label}
              key={`option-${option.value}`}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}

RadioButtons.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  control: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
};

export default RadioButtons;
