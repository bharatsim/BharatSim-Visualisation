import React from 'react';
import PropTypes from 'prop-types';

import { Box, makeStyles, Typography } from '@material-ui/core';
import { useForm } from 'react-final-form';

import { convertObjectArrayToOptionStructure } from '../../utils/helper';
import { timeIntervalStrategies, timeSliderConfig } from '../../constants/sliderConfigs';
import SwitchField from '../../uiComponent/formField/SwitchField';
import DropDownField from '../../uiComponent/formField/SelectField';
import RadioButtonsField from '../../uiComponent/formField/RadioButtonField';
import TextField from '../../uiComponent/formField/TextField';
import { required } from '../../utils/validators';

const useStyles = makeStyles((theme) => {
  return {
    fieldContainer: {
      display: 'flex',
      padding: theme.spacing(2),
      '& > *': {
        marginRight: theme.spacing(12),
      },
    },
    timeFieldContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    headerContainer: {
      display: 'flex',
      alignItems: 'center',
    },
  };
});

function TimeSliderConfig({ headers, configKey }) {
  const classes = useStyles();

  const { getFieldState } = useForm();

  const showSliderConfig = getFieldState(`${configKey}.${timeSliderConfig.TIME_CONFIG_TOGGLE}`)
    ?.value;
  const selectedIntervalStrategy = getFieldState(`${configKey}.${timeSliderConfig.STRATEGY}`)
    ?.value;

  return (
    <Box>
      <Box mb={1} pl={2} className={classes.headerContainer}>
        <Typography variant="subtitle2">Time Dimension</Typography>
        <Box ml={2}>
          <SwitchField
            dataTestId="toggle-time-slider"
            name={`${configKey}.${timeSliderConfig.TIME_CONFIG_TOGGLE}`}
            onLabel="Yes"
            offLabel="No"
            validate={required}
          />
        </Box>
      </Box>
      {showSliderConfig && (
        <>
          <Box className={classes.fieldContainer}>
            <Box>
              <Typography variant="body1">Time</Typography>
              <DropDownField
                options={convertObjectArrayToOptionStructure(headers, 'name', 'name')}
                id="timeMetrics"
                label="select Time Metrics"
                name={`${configKey}.${timeSliderConfig.TIME_METRICS}`}
                validate={required}
              />
            </Box>
          </Box>
          <Box className={[classes.fieldContainer, classes.timeFieldContainer].join(' ')}>
            <Box>
              <Typography variant="body1">Time Interval</Typography>
              <RadioButtonsField
                defaultValue={timeIntervalStrategies.DEFAULT_INTERVALS}
                name={`${configKey}.${timeSliderConfig.STRATEGY}`}
                options={[
                  {
                    value: timeIntervalStrategies.DEFAULT_INTERVALS,
                    label: 'Use predefined interval',
                  },
                  {
                    value: timeIntervalStrategies.STEP_SIZE,
                    label: 'Specify step size',
                  },
                ]}
                validate={required}
              />
            </Box>
            <Box>
              {selectedIntervalStrategy === 'stepSize' && (
                <TextField
                  type="number"
                  defaultValue={1}
                  name={`${configKey}.${timeSliderConfig.STEP_SIZE}`}
                  label="select step size"
                  dataTestId="stepsize-input-box"
                  validate={required}
                />
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

TimeSliderConfig.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configKey: PropTypes.string.isRequired,
};

export default TimeSliderConfig;
