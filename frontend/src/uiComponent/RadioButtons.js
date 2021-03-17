import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import { useController } from 'react-hook-form';
import Radio from '@material-ui/core/Radio';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

function RadioButtons({ options, control, name, defaultValue, vertical, disabled }) {
  const classes = useStyles();
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
    defaultValue,
  });
  return (
    <FormControl disabled={disabled}>
      <RadioGroup value={value} onChange={onChange}>
        <Box className={vertical ? classes.vertical : classes.horizontal}>
          {options.map((option) => {
            return (
              <FormControlLabel
                value={option.value}
                control={<Radio size="small" />}
                label={option.label}
                key={`option-${option.value}`}
                name={option.label}
              />
            );
          })}
        </Box>
      </RadioGroup>
    </FormControl>
  );
}

RadioButtons.defaultProps = {
  vertical: true,
  disabled: false,
};

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
  vertical: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default RadioButtons;
