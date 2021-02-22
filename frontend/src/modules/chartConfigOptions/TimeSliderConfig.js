import React from 'react';
import PropTypes from 'prop-types';

import { Box, makeStyles, Typography } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';

import { convertObjectArrayToOptionStructure } from '../../utils/helper';
import { timeIntervalStrategies, timeSliderConfig } from '../../constants/sliderConfigs';
import AntSwitch from '../../uiComponent/AntSwitch';
import ControlledDropDown from '../../uiComponent/ControlledDropdown';
import UncontrolledInputTextField from '../../uiComponent/UncontrolledInputField';
import RadioButtons from '../../uiComponent/RadioButtons';

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
  const {
    errors: formErrors,
    control,
    watch,
    register,
    setValue,
    defaultValues: formDefaultValues,
  } = useFormContext();
  const errors = formErrors[configKey] || { [timeSliderConfig.TIME_METRICS]: {} };
  const defaultValues = formDefaultValues[configKey] || {};

  const showSliderConfig = watch(`${configKey}.${timeSliderConfig.TIME_CONFIG_TOGGLE}`);
  const selectedIntervalStrategy = watch(`${configKey}.${timeSliderConfig.STRATEGY}`);

  return (
    <Box>
      <Box mb={1} pl={2} className={classes.headerContainer}>
        <Typography variant="subtitle2">Time Dimension</Typography>
        <Box ml={2}>
          <AntSwitch
            dataTestid="toggle-time-slider"
            control={control}
            name={`${configKey}.${timeSliderConfig.TIME_CONFIG_TOGGLE}`}
            onLabel="Yes"
            offLabel="No"
          />
        </Box>
      </Box>
      {showSliderConfig && (
        <>
          <Box className={classes.fieldContainer}>
            <Box>
              <Typography variant="body1">Time</Typography>
              <ControlledDropDown
                options={convertObjectArrayToOptionStructure(headers, 'name', 'name')}
                id="timeMetrics"
                key="dropdown-timeMetrics"
                label="select Time Metrics"
                control={control}
                validations={{ required: 'Required' }}
                name={`${configKey}.${timeSliderConfig.TIME_METRICS}`}
                error={errors[timeSliderConfig.TIME_METRICS]}
                setValue={setValue}
                defaultValue={defaultValues[timeSliderConfig.TIME_METRICS]}
              />
            </Box>
          </Box>
          <Box className={[classes.fieldContainer, classes.timeFieldContainer].join(' ')}>
            <Box>
              <Typography variant="body1">Time Interval</Typography>
              <RadioButtons
                defaultValue={timeIntervalStrategies.DEFAULT_INTERVALS}
                control={control}
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
              />
            </Box>
            <Box>
              {selectedIntervalStrategy === 'stepSize' && (
                <UncontrolledInputTextField
                  type="number"
                  defaultValue={1}
                  name={`${configKey}.${timeSliderConfig.STEP_SIZE}`}
                  register={register}
                  error={errors[timeSliderConfig.STEP_SIZE]}
                  label="select step size"
                  dataTestid="stepsize-input-box"
                  validations={{
                    required: 'Required',
                    min: { value: 1, message: 'step size should not be less than 1' },
                  }}
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
