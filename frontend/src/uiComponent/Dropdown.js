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
    minWidth: theme.spacing(52),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  helperText: {
    marginLeft: 0,
  },
}));

const useMenuListStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 0),
  },
}));

const useMenuListItemStyles = makeStyles((theme) => ({
  root: {
    '&:hover': {
      backgroundColor: `${theme.colors.primaryColorScale['50']} !important`,
    },
  },
  selected: {
    backgroundColor: `${theme.colors.primaryColorScale['400']} !important`,
    color: `${theme.colors.textLight.primary} !important`,
    '&:hover': {
      backgroundColor: `${theme.colors.primaryColorScale['400']} !important`,
    },
  },
}));

function renderMenuItems(id, options, classes) {
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
          classes={classes}
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
  helperText,
  ...rest
}) {
  const classes = useStyles();
  const menuListClasses = useMenuListStyles();
  const menuListItemClasses = useMenuListItemStyles();

  return (
    <FormControl variant="filled" className={classes.formControl} error={!!error}>
      <InputLabel id="dropdown-label">{label}</InputLabel>
      <Select
        labelId="dropdown-label"
        id={id}
        value={value}
        onChange={onChange}
        multiple={multiple}
        label={label}
        data-testid={id}
        MenuProps={{ id: `menu-${id}`, MenuListProps: { classes: menuListClasses } }}
        {...rest}
      >
        {renderMenuItems(id, options, menuListItemClasses)}
      </Select>
      {!!helperText && (
        <FormHelperText classes={{ root: classes.helperText }}>{helperText}</FormHelperText>
      )}
      {!!error && (
        <FormHelperText error classes={{ root: classes.helperText }}>
          {error}
        </FormHelperText>
      )}
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
  helperText: '',
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
  helperText: PropTypes.string,
  value: valuePropType.isRequired,
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
};
