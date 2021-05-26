import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-final-form';
import BarStyleConfig from './BarStylesConfig';
import FieldArrayContainer from '../../uiComponent/formField/FieldArrayContainer';
import FieldsContainer from '../../uiComponent/formField/FieldsContainer';

function BarChartSeriesStyles({ seriesConfigKey, title }) {
  const { getFieldState } = useForm();
  const series = getFieldState(seriesConfigKey)?.value;

  return (
    <FieldArrayContainer
      title={title}
      configKey={seriesConfigKey}
      shouldRender={!!series}
      fallbackMessage="Select Y axis measure to add styles"
      field={(name, index) => {
        return (
          <FieldsContainer>
            <BarStyleConfig name={name} index={index} seriesName={series[index]?.name} key={name} />
          </FieldsContainer>
        );
      }}
    />
  );
}

BarChartSeriesStyles.propTypes = {
  seriesConfigKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default BarChartSeriesStyles;
