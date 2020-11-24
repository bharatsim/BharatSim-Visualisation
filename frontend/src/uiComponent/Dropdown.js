import React from 'react';
import PropTypes from 'prop-types';

import {
  FormControl,
  FormHelperText,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 320,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function renderMenuItems(id, options) {
  return (
    options &&
    options.map(({ value, displayName }, index) => {
      const key = `${displayName}-${index}`;
      return (
        <MenuItem
          value={value}
          key={key}
          id={`${id}-${displayName}`}
          data-testid={`${id}-${displayName}`}
        >
          {displayName}
        </MenuItem>
      );
    })
  );
}

export default function Dropdown({
  label,
  options,
  id,
  error,
  value,
  onChange,
  multiple,
  ...rest
}) {
  const classes = useStyles();

  function handleChange(event) {
    onChange(event.target.value);
  }

  return (
    <FormControl variant="filled" className={classes.formControl} error={!!error}>
      <InputLabel id="dropdown-label">{label}</InputLabel>
      <Select
        labelId="dropdown-label"
        id={id}
        value={value}
        onChange={handleChange}
        multiple={multiple}
        label={label}
        data-testid={id}
        MenuProps={{ id: `menu-${id}` }}
        {...rest}
      >
        {renderMenuItems(id, options)}
      </Select>
      {!!error && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );
}

const valuePropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({}),
  PropTypes.number,
  PropTypes.array,
]);

Dropdown.defaultProps = {
  error: '',
  multiple: false,
};

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: valuePropType.isRequired,
      displayName: PropTypes.string.isRequired,
    }),
  ).isRequired,
  id: PropTypes.string.isRequired,
  error: PropTypes.string,
  value: valuePropType.isRequired,
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
};
