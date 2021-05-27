import React from 'react';
import PropTypes from 'prop-types';

import { Box } from '@material-ui/core';
import { useForm } from 'react-final-form';

import { convertObjectArrayToOptionStructure } from '../../utils/helper';
import { timeIntervalStrategies, timeSliderConfig } from '../../constants/sliderConfigs';
import SwitchField from '../../uiComponent/formField/SwitchField';
import DropDownField from '../../uiComponent/formField/SelectField';
import RadioButtonsField from '../../uiComponent/formField/RadioButtonField';
import TextField from '../../uiComponent/formField/TextField';
import { required, validateStepSize } from '../../utils/validators';
import FieldContainer from '../../uiComponent/formField/FieldContainer';
import FieldsContainer from '../../uiComponent/formField/FieldsContainer';

function TimeSliderConfig({ headers, configKey }) {
  const { getFieldState } = useForm();

  const showSliderConfig = getFieldState(`${configKey}.${timeSliderConfig.TIME_CONFIG_TOGGLE}`)
    ?.value;
  const selectedIntervalStrategy = getFieldState(`${configKey}.${timeSliderConfig.STRATEGY}`)
    ?.value;

  return (
    <Box>
      <FieldContainer title="Time Dimension" inline>
        <SwitchField
          dataTestId="toggle-time-slider"
          name={`${configKey}.${timeSliderConfig.TIME_CONFIG_TOGGLE}`}
          onLabel="Yes"
          offLabel="No"
          validate={required}
        />
      </FieldContainer>
      {showSliderConfig && (
        <Box mt={3}>
          <FieldsContainer>
            <FieldContainer title="Time">
              <DropDownField
                options={convertObjectArrayToOptionStructure(headers, 'name', 'name')}
                id="timeMetrics"
                label="Select Time Metrics"
                name={`${configKey}.${timeSliderConfig.TIME_METRICS}`}
                validate={required}
              />
            </FieldContainer>
            <FieldContainer title="Time Interval">
              <FieldsContainer>
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
                {selectedIntervalStrategy === 'stepSize' && (
                  <TextField
                    type="number"
                    defaultValue={1}
                    name={`${configKey}.${timeSliderConfig.STEP_SIZE}`}
                    label="Select step size"
                    dataTestId="stepsize-input-box"
                    validate={validateStepSize}
                  />
                )}
              </FieldsContainer>
            </FieldContainer>
          </FieldsContainer>
        </Box>
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
