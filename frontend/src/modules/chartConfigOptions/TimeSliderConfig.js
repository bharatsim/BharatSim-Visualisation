import React from 'react';
import PropTypes from 'prop-types';

import { Box, makeStyles, Typography } from '@material-ui/core';
import { convertObjectArrayToOptionStructure } from '../../utils/helper';
import { timeSliderConfig } from '../../constants/sliderConfigs';
import AntSwitch from '../../uiComponent/AntSwitch';
import ControlledDropDown from '../../uiComponent/ControlledDropdown';

const useStyles = makeStyles((theme) => {
  return {
    fieldContainer: {
      display: 'flex',
      padding: theme.spacing(2),
      '& > *': {
        marginRight: theme.spacing(12),
      },
    },
    headerContainer: {
      display: 'flex',
      alignItems: 'center',
    },
  };
});

function TimeSliderConfig({ headers, configKey, control, register, watch, errors }) {
  const classes = useStyles();
  const showSliderConfig = watch(`${configKey}.${timeSliderConfig.TIME_CONFIG_TOGGLE}`);

  return (
    <Box>
      <Box mb={1} pl={2} className={classes.headerContainer}>
        <Typography variant="subtitle2">Time Dimension</Typography>
        <Box ml={2}>
          <AntSwitch
            dataTestid="toggle-time-slider"
            register={register}
            name={`${configKey}.${timeSliderConfig.TIME_CONFIG_TOGGLE}`}
            onLabel="Yes"
            offLabel="No"
          />
        </Box>
      </Box>
      {showSliderConfig && (
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
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

TimeSliderConfig.defaultProps = {
  errors: { [timeSliderConfig.TIME_METRICS]: {} },
};

TimeSliderConfig.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configKey: PropTypes.string.isRequired,
  errors: PropTypes.shape({
    [timeSliderConfig.TIME_METRICS]: PropTypes.shape({}),
  }),
  control: PropTypes.shape({}).isRequired,
  register: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
};

export default TimeSliderConfig;
