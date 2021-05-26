import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-final-form';
import LineStyleConfig from './LineStyleConfigs';
import FieldArrayContainer from '../../uiComponent/formField/FieldArrayContainer';

function LineChartSeriesStyles({ seriesConfigKey, title }) {
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
          <LineStyleConfig name={name} index={index} seriesName={series[index]?.name} key={name} />
        );
      }}
    />
  );
}

LineChartSeriesStyles.propTypes = {
  seriesConfigKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default LineChartSeriesStyles;
