import React, { useEffect } from 'react';
import { useForm } from 'react-final-form';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import { format } from 'date-fns';

import TextField from '../../uiComponent/formField/TextField';
import FieldsContainer from '../../uiComponent/formField/FieldsContainer';
import FieldContainer from '../../uiComponent/formField/FieldContainer';
import SwitchField from '../../uiComponent/formField/SwitchField';
import { required, validateToValueDate, validateToValueNumber } from '../../utils/validators';
import SelectField from '../../uiComponent/formField/SelectField';
import { rangeTypes, DATE_FORMAT } from '../../constants/annotations';
import Condition from '../../uiComponent/formField/ConditionalField';
import DateField from '../../uiComponent/formField/DateField';
import { currentDate } from '../../utils/dateUtils';

const rangeTypeOptions = [
  { value: rangeTypes.DATE, displayName: 'Date' },
  { value: rangeTypes.NUMERIC, displayName: 'Numeric' },
];

const axisConfig = {
  AXIS_NAME: 'axisTitle',
  AXIS_RANGE: 'axisRange',
  AXIS_START_RANGE: 'start',
  AXIS_END_RANGE: 'end',
  AXIS_RANGE_TYPE: 'axisRangeType',
};

function AxisConfig({ configKey, axis, title }) {
  const { getFieldState, change } = useForm();
  const xAxisNameField = getFieldState(axis);
  const xAxisLabelName = `${configKey}.${axisConfig.AXIS_NAME}`;
  const xAxisLabelField = getFieldState(xAxisLabelName);
  const isRange = getFieldState(`${configKey}.${axisConfig.AXIS_RANGE}`)?.value;

  useEffect(() => {
    if (!xAxisLabelField || !xAxisNameField) return;
    if (!xAxisLabelField.dirty && !xAxisNameField.dirty) {
      change(xAxisLabelName, xAxisLabelField.initial || xAxisNameField.value);
      return;
    }
    change(xAxisLabelName, xAxisNameField.value);
  }, [xAxisNameField?.value]);

  return (
    <FieldsContainer title={title}>
      <FieldContainer>
        <TextField
          name={`${configKey}.${axisConfig.AXIS_NAME}`}
          dataTestId="axis-title"
          label="Enter axis label"
          defaultValue=""
        />
      </FieldContainer>
      <FieldContainer title="Range" inline>
        <SwitchField
          dataTestId="axis-range"
          name={`${configKey}.${axisConfig.AXIS_RANGE}`}
          offLabel="no"
          onLabel="yes"
          defaultValue={false}
        />
      </FieldContainer>
      {isRange && (
        <>
          <FieldContainer title="Type">
            <SelectField
              name={`${configKey}.${axisConfig.AXIS_RANGE_TYPE}`}
              options={rangeTypeOptions}
              id="type-of-range"
              label="Select type"
              validate={required}
              defaultValue={rangeTypes.NUMERIC}
            />
          </FieldContainer>
          <FieldContainer title="Range">
            <Condition when={`${configKey}.${axisConfig.AXIS_RANGE_TYPE}`} is={rangeTypes.NUMERIC}>
              <TextField
                type="number"
                name={`${configKey}.${rangeTypes.NUMERIC}.${axisConfig.AXIS_START_RANGE}`}
                label="From value"
                dataTestId="start-input"
                validate={required}
              />
              <TextField
                type="number"
                name={`${configKey}.${rangeTypes.NUMERIC}.${axisConfig.AXIS_END_RANGE}`}
                label="To Value"
                dataTestId="end-input"
                validate={(value, values) =>
                  validateToValueNumber(
                    value,
                    get(
                      values,
                      `${configKey}.${rangeTypes.NUMERIC}.${axisConfig.AXIS_START_RANGE}`,
                    ),
                  )
                }
              />
            </Condition>
            <Condition when={`${configKey}.${axisConfig.AXIS_RANGE_TYPE}`} is={rangeTypes.DATE}>
              <DateField
                name={`${configKey}.${rangeTypes.DATE}.${axisConfig.AXIS_START_RANGE}`}
                label="From value"
                dataTestId="start-input"
                validate={required}
                defaultValue={format(currentDate(), DATE_FORMAT)}
                format={DATE_FORMAT}
              />
              <DateField
                name={`${configKey}.${rangeTypes.DATE}.${axisConfig.AXIS_END_RANGE}`}
                label="To Value"
                dataTestId="end-input"
                defaultValue={format(currentDate(), DATE_FORMAT)}
                format={DATE_FORMAT}
                validate={(value, values) =>
                  validateToValueDate(
                    value,
                    get(values, `${configKey}.${rangeTypes.DATE}.${axisConfig.AXIS_START_RANGE}`),
                  )
                }
              />
            </Condition>
          </FieldContainer>
        </>
      )}
    </FieldsContainer>
  );
}

AxisConfig.defaultProps = {
  axis: '',
};

AxisConfig.propTypes = {
  configKey: PropTypes.string.isRequired,
  axis: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default AxisConfig;
