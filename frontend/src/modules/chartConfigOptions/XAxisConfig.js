import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-final-form';

import { convertObjectArrayToOptionStructure } from '../../utils/helper';
import DropDownField from '../../uiComponent/formField/SelectField';
import { required } from '../../utils/validators';
import FieldContainer from '../../uiComponent/formField/FieldContainer';

const xAxisConfigNames = {
  TYPE: 'type',
  NAME: 'columnName',
};

const axisTypeOptions = [
  { value: '-', displayName: 'Default' },
  { value: 'date', displayName: 'Date' },
  { value: 'category', displayName: 'Category' },
  { value: 'linear', displayName: 'Linear' },
  { value: 'log', displayName: 'Log' },
];

function XAxisConfig({ headers, configKey }) {
  const { getFieldState } = useForm();

  const selectedType = getFieldState(`${configKey}.${xAxisConfigNames.TYPE}`)?.value;

  return (
    <FieldContainer title="X axis">
      <DropDownField
        id="x-axis-dropdown"
        key="dropdown-x-axis"
        label="select x axis"
        title="x axis"
        options={convertObjectArrayToOptionStructure(headers, 'name', 'name')}
        name={`${configKey}.${xAxisConfigNames.NAME}`}
        border={false}
        validate={required}
      />
      <DropDownField
        id="x-axis-type-dropdown"
        label="select x axis type"
        key="dropdown-x-axis-type"
        title="x axis type"
        options={axisTypeOptions}
        name={`${configKey}.${xAxisConfigNames.TYPE}`}
        border={false}
        helperText={
          selectedType === 'date' ? 'Only YYYY-mm-dd HH:MM:SS.sss date format is supported' : ''
        }
        defaultValue="-"
        validate={required}
      />
    </FieldContainer>
  );
}

XAxisConfig.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configKey: PropTypes.string.isRequired,
};

export default XAxisConfig;
