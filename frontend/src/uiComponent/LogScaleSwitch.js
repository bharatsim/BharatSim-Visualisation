import React from 'react';
import PropTypes from 'prop-types';
import { Box, FormControlLabel, Switch, withStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  switchContainer: {
    position: 'absolute',
    zIndex: 1111,
    marginLeft: theme.spacing(4),
  },
  checkedLabel: {
    ...theme.typography.body2,
    color: theme.colors.primaryColorScale['500'],
  },
  uncheckedLabel: {
    ...theme.typography.body2,
    color: theme.colors.grayScale['400'],
  },
}));

const LogSwitch = withStyles((theme) => ({
  switchBase: {
    color: theme.colors.grayScale['400'],
    '&$checked': {
      color: theme.colors.primaryColorScale['500'],
    },
    '&$checked + $track': {
      color: theme.colors.primaryColorScale['500'],
      opacity: 1,
      backgroundColor: theme.colors.primaryColorScale['200'],
      borderColor: theme.colors.primaryColorScale['200'],
    },
  },
  checked: {},
  track: {
    backgroundColor: theme.colors.grayScale['200'],
  },
}))(Switch);

function LogScaleSwitch({ isChecked, onChange }) {
  const classes = useStyles();
  return (
    <Box className={classes.switchContainer}>
      <FormControlLabel
        control={<LogSwitch checked={isChecked} onChange={onChange} name="Log" size="small" />}
        label="Log Scale"
        classes={{ label: isChecked ? classes.checkedLabel : classes.uncheckedLabel }}
      />
    </Box>
  );
}

LogScaleSwitch.defaultProps = {
  isChecked: false,
};

LogScaleSwitch.propTypes = {
  isChecked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default LogScaleSwitch;
