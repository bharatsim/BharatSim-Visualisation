import React, { useEffect } from 'react';
import { useForm } from 'react-final-form';
import PropTypes from 'prop-types';
import TextField from '../../uiComponent/formField/TextField';
import FieldsContainer from '../../uiComponent/formField/FieldsContainer';
import FieldContainer from '../../uiComponent/formField/FieldContainer';

const axisConfig = {
  X_AXIS_NAME: 'xAxisTitle',
  Y_AXIS_NAME: 'yAxisTitle',
};

function AxisConfig({ configKey, xAxis }) {
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
    <FieldsContainer title="Axis">
      <FieldContainer title="X Axis">
        <TextField
          name={`${configKey}.${axisConfig.X_AXIS_NAME}`}
          dataTestId="x-axis-title"
          label="Enter X axis label"
          defaultValue=""
        />
      </FieldContainer>
      <FieldContainer title="Y Axis">
        <TextField
          name={`${configKey}.${axisConfig.Y_AXIS_NAME}`}
          dataTestId="y-axis-title"
          label="Enter Y axis label"
          defaultValue=""
        />
      </FieldContainer>
    </FieldsContainer>
  );
}

AxisConfig.propTypes = {
  configKey: PropTypes.string.isRequired,
  xAxis: PropTypes.string.isRequired,
};

export default AxisConfig;
