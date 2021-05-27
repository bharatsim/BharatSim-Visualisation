import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-final-form';
import { convertObjectArrayToOptionStructure } from '../../utils/helper';
import DropDownField from '../../uiComponent/formField/SelectField';
import { required } from '../../utils/validators';
import FieldArrayContainer from '../../uiComponent/formField/FieldArrayContainer';
import FieldContainer from '../../uiComponent/formField/FieldContainer';

function YAxisChartConfig({ headers, configKey }) {
  const { getFieldState } = useForm();
  const {
    mutators: { push },
  } = useForm();

  useEffect(() => {
    if (!getFieldState(configKey)?.value) {
      push(configKey);
    }
  }, []);

  return (
    <FieldArrayContainer
      title="Y-axis"
      configKey={configKey}
      addButtonTitle="Add Metric"
      onAddClick={() => push(configKey)}
      field={(name, index) => {
        return (
          <FieldContainer>
            <DropDownField
              options={convertObjectArrayToOptionStructure(headers, 'name', 'name')}
              id={`y-axis-dropdown-${index}`}
              label="Select y axis"
              name={`${name}.name`}
              validations={{ required: 'Required' }}
              validate={required}
            />
          </FieldContainer>
        );
      }}
    />
  );
}

YAxisChartConfig.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configKey: PropTypes.string.isRequired,
};

export default YAxisChartConfig;
