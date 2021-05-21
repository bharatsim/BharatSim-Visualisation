import React, { useEffect } from 'react';
import { useForm } from 'react-final-form';
import PropTypes from 'prop-types';

import { Box, makeStyles, Typography } from '@material-ui/core';
import TextField from '../../uiComponent/formField/TextField';

const useStyles = makeStyles((theme) => {
  return {
    fieldContainer: {
      display: 'flex',
      alignItems: 'center',
      '& + &': {
        marginTop: theme.spacing(4),
      },
    },
    verticalFieldContainer: {
      '& > * + *': {
        marginTop: theme.spacing(1),
      },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  };
});

const axisConfig = {
  X_AXIS_NAME: 'xAxisTitle',
  Y_AXIS_NAME: 'yAxisTitle',
};

function AxisConfig({ configKey, xAxis }) {
  const classes = useStyles();
  const { getFieldState, change } = useForm();
  const xAxisNameField = getFieldState(xAxis);
  const xAxisLabelName = `${configKey}.${axisConfig.X_AXIS_NAME}`;
  const xAxisLabelField = getFieldState(xAxisLabelName);

  useEffect(() => {
    if (!xAxisLabelField || !xAxisNameField) return;
    if (!xAxisLabelField.dirty && !xAxisNameField.dirty) {
      change(xAxisLabelName, xAxisLabelField.initial || xAxisNameField.value);
      return;
    }
    change(xAxisLabelName, xAxisNameField.value);
  }, [xAxisNameField?.value]);

  return (
    <Box>
      <Box mb={2}>
        <Typography variant="subtitle2">Axis</Typography>
      </Box>
      <Box className={`${classes.fieldContainer} ${classes.verticalFieldContainer}`}>
        <Typography variant="subtitle2">X Axis</Typography>
        <TextField
          name={`${configKey}.${axisConfig.X_AXIS_NAME}`}
          dataTestId="x-axis-title"
          label="Enter X axis label"
          defaultValue=""
        />
      </Box>
      <Box className={`${classes.fieldContainer} ${classes.verticalFieldContainer}`}>
        <Typography variant="subtitle2">Y Axis</Typography>
        <TextField
          name={`${configKey}.${axisConfig.Y_AXIS_NAME}`}
          dataTestId="y-axis-title"
          label="Enter Y axis label"
          defaultValue=""
        />
      </Box>
    </Box>
  );
}

AxisConfig.propTypes = {
  configKey: PropTypes.string.isRequired,
  xAxis: PropTypes.string.isRequired,
};

export default AxisConfig;
