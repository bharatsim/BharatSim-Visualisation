/* eslint-disable react/prop-types */
import React from 'react';
import XAxisChartConfig from '../modules/chartConfigOptions/XAxisChartConfig';
import YAxisChartConfig from '../modules/chartConfigOptions/YAxisChartConfig';
import { geoMetricValidator, xAxisValidator, yAxisValidator } from '../utils/validators';
import { chartConfigOptionTypes } from '../constants/chartConfigOptionTypes';
import GeoMetricsSeries from '../modules/chartConfigOptions/GeoMetricSeries';
import GeoDimensions from '../modules/chartConfigOptions/GeoDimensions';

const chartConfigOptions = {
  [chartConfigOptionTypes.X_AXIS]: {
    component: ({ headers, handleConfigChange, errors, values }) => (
      <XAxisChartConfig
        headers={headers}
        handleConfigChange={handleConfigChange}
        configKey={chartConfigOptionTypes.X_AXIS}
        error={errors[chartConfigOptionTypes.X_AXIS]}
        value={values[chartConfigOptionTypes.X_AXIS]}
      />
    ),
    validator: xAxisValidator,
  },
  [chartConfigOptionTypes.Y_AXIS]: {
    component: ({ headers, handleConfigChange, errors, values }) => (
      <YAxisChartConfig
        headers={headers}
        handleConfigChange={handleConfigChange}
        configKey={chartConfigOptionTypes.Y_AXIS}
        error={errors[chartConfigOptionTypes.Y_AXIS]}
        value={values[chartConfigOptionTypes.Y_AXIS]}
      />
    ),
    validator: yAxisValidator,
  },

  [chartConfigOptionTypes.GEO_DIMENSIONS]: {
    component: ({ headers, handleConfigChange, errors, values, handleError }) => (
      <GeoDimensions
        headers={headers}
        handleConfigChange={handleConfigChange}
        configKey={chartConfigOptionTypes.GEO_DIMENSIONS}
        error={errors[chartConfigOptionTypes.GEO_DIMENSIONS]}
        value={values[chartConfigOptionTypes.GEO_DIMENSIONS]}
        handleError={handleError}
      />
    ),
  },

  [chartConfigOptionTypes.GEO_METRIC_SERIES]: {
    component: ({ headers, handleConfigChange, errors, values }) => (
      <GeoMetricsSeries
        headers={headers}
        handleConfigChange={handleConfigChange}
        configKey={chartConfigOptionTypes.GEO_METRIC_SERIES}
        error={errors[chartConfigOptionTypes.GEO_METRIC_SERIES]}
        value={values[chartConfigOptionTypes.GEO_METRIC_SERIES]}
      />
    ),
    validator: geoMetricValidator,
  },
};

function createConfigOptionValidationSchema(configOptions) {
  const configOptionValidationSchema = {};
  configOptions.forEach((configOption) => {
    configOptionValidationSchema[configOption] = chartConfigOptions[configOption].validator;
  });

  return configOptionValidationSchema;
}
export { createConfigOptionValidationSchema };
export default chartConfigOptions;
