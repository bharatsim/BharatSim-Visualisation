/* eslint-disable react/prop-types */
import React from 'react';
import XAxisChartConfig from '../modules/chartConfigOptions/XAxisChartConfig';
import YAxisChartConfig from '../modules/chartConfigOptions/YAxisChartConfig';
import { xAxisValidator, yAxisValidator } from '../utils/validators';
import { chartConfigOptionTypes } from '../constants/chartConfigOptionTypes';
import LongitudeChartConfig from '../modules/chartConfigOptions/LongitudeChartConfig';
import LatitudeChartConfig from '../modules/chartConfigOptions/LatitudeChartConfig';
import GeoMetricsSeries from '../modules/chartConfigOptions/GeoMetricSeries';

const chartConfigOptions = {
  [chartConfigOptionTypes.X_AXIS]: {
    component: ({ headers, updateConfigState, errors, values }) => (
      <XAxisChartConfig
        headers={headers}
        updateConfigState={updateConfigState}
        configKey={chartConfigOptionTypes.X_AXIS}
        error={errors[chartConfigOptionTypes.X_AXIS]}
        value={values[chartConfigOptionTypes.X_AXIS]}
      />
    ),
    validator: xAxisValidator,
  },
  [chartConfigOptionTypes.Y_AXIS]: {
    component: ({ headers, updateConfigState, errors, values }) => (
      <YAxisChartConfig
        headers={headers}
        updateConfigState={updateConfigState}
        configKey={chartConfigOptionTypes.Y_AXIS}
        error={errors[chartConfigOptionTypes.Y_AXIS]}
        value={values[chartConfigOptionTypes.Y_AXIS]}
      />
    ),
    validator: yAxisValidator,
  },
  [chartConfigOptionTypes.LONGITUDE]: {
    component: ({ headers, updateConfigState, errors, values }) => (
      <LongitudeChartConfig
        headers={headers}
        updateConfigState={updateConfigState}
        configKey={chartConfigOptionTypes.LONGITUDE}
        error={errors[chartConfigOptionTypes.LONGITUDE]}
        value={values[chartConfigOptionTypes.LONGITUDE]}
      />
    ),
    validator: xAxisValidator,
  },
  [chartConfigOptionTypes.LATITUDE]: {
    component: ({ headers, updateConfigState, errors, values }) => (
      <LatitudeChartConfig
        headers={headers}
        updateConfigState={updateConfigState}
        configKey={chartConfigOptionTypes.LATITUDE}
        error={errors[chartConfigOptionTypes.LATITUDE]}
        value={values[chartConfigOptionTypes.LATITUDE]}
      />
    ),
    validator: xAxisValidator,
  },
  [chartConfigOptionTypes.GEO_METRIC_SERIES]: {
    component: ({ headers, updateConfigState, errors, values }) => (
      <GeoMetricsSeries
        headers={headers}
        updateConfigState={updateConfigState}
        configKey={chartConfigOptionTypes.GEO_METRIC_SERIES}
        error={errors[chartConfigOptionTypes.GEO_METRIC_SERIES]}
        value={values[chartConfigOptionTypes.GEO_METRIC_SERIES]}
      />
    ),
    validator: xAxisValidator,
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
