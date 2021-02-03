import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Box, makeStyles, Typography } from '@material-ui/core';
import Dropdown from '../../uiComponent/Dropdown';
import { convertObjectArrayToOptionStructure } from '../../utils/helper';
import { timeSliderConfig } from '../../constants/sliderConfigs';
import { requiredValueForDropdown } from '../../utils/validators';
import AntSwitch from '../../uiComponent/AntSwitch';

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

function TimeSliderConfig({ headers, handleConfigChange, configKey, value, handleError }) {
  const classes = useStyles();
  const [validationError, setValidationError] = useState({});
  const [switchChecked, setSwitchChecked] = useState(false);

  useEffect(() => {
    if (hasEmptyValues()) {
      setErrorForValidationErrors();
    }
  }, [validationError, switchChecked]);

  useEffect(() => {
    if (!switchChecked) {
      handleConfigChange(configKey, { ...value, [timeSliderConfig.TIME_METRICS]: '' });
    }
  }, [switchChecked]);

  function hasEmptyValues() {
    if (!switchChecked) {
      return '';
    }
    return value[timeSliderConfig.TIME_METRICS] === '';
  }

  function setErrorForValidationErrors() {
    const isValidationError = Object.values(timeSliderConfig).some(
      (timeMetricsValue) => validationError[timeMetricsValue] !== '',
    );
    handleError(configKey, isValidationError ? 'error' : '');
  }

  function handleTimeMetricsChange(selectedValue) {
    setValidationError({
      ...validationError,
      [timeSliderConfig.TIME_METRICS]: requiredValueForDropdown(selectedValue),
    });
    handleConfigChange(configKey, { ...value, [timeSliderConfig.TIME_METRICS]: selectedValue });
  }

  function handleSwitchChange(e, val) {
    setSwitchChecked(val);
  }

  return (
    <Box>
      <Box mb={1} pl={2} className={classes.headerContainer}>
        <Typography variant="subtitle2">Time Dimension</Typography>
        <Box ml={2}>
          <AntSwitch
            dataTestid="toggle-time-slider"
            checked={switchChecked}
            onChange={handleSwitchChange}
            onLabel="Yes"
            offLabel="No"
          />
        </Box>
      </Box>
      {switchChecked && (
        <Box className={classes.fieldContainer}>
          <Box>
            <Typography variant="body1">Time</Typography>
            <Dropdown
              options={convertObjectArrayToOptionStructure(headers, 'name', 'name')}
              onChange={handleTimeMetricsChange}
              id="timeMetrics"
              key="dropdown-timeMetrics"
              label="select Time Metrics"
              value={value[timeSliderConfig.TIME_METRICS]}
              error={validationError[timeSliderConfig.TIME_METRICS]}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

TimeSliderConfig.defaultProps = {
  value: { [timeSliderConfig.TIME_METRICS]: '', [timeSliderConfig.INTERVAL]: 1 },
};

TimeSliderConfig.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  handleConfigChange: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  configKey: PropTypes.string.isRequired,
  value: PropTypes.shape({
    [timeSliderConfig.TIME_METRICS]: PropTypes.string,
  }),
};

export default TimeSliderConfig;
