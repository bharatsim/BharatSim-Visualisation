/* eslint-disable react/prop-types */
import React from 'react';
import XAxisChartConfig from '../modules/chartConfigOptions/XAxisChartConfig';
import YAxisChartConfig from '../modules/chartConfigOptions/YAxisChartConfig';
import {
  geoMetricValidator,
  requiredValueForDropdown,
  xAxisValidator,
  yAxisValidator,
} from '../utils/validators';
import { chartConfigOptionTypes } from '../constants/chartConfigOptionTypes';
import GeoMetricsSeries from '../modules/chartConfigOptions/GeoMetricSeriesConfig';
import GeoDimensionsConfig from '../modules/chartConfigOptions/GeoDimensionsConfig';
import GISShapeLayerConfig from '../modules/chartConfigOptions/GISShapeLayerConfig';
import ChartConfigDropdown from '../modules/chartConfigOptions/ChartConfigDropdown';

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
      <GeoDimensionsConfig
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
  [chartConfigOptionTypes.GIS_SHAPE_LAYER]: {
    component: ({ handleConfigChange, errors, values, isEditMode }) => (
      <GISShapeLayerConfig
        handleConfigChange={handleConfigChange}
        isEditMode={isEditMode}
        configKey={chartConfigOptionTypes.GIS_SHAPE_LAYER}
        error={errors[chartConfigOptionTypes.GIS_SHAPE_LAYER]}
        value={values[chartConfigOptionTypes.GIS_SHAPE_LAYER]}
      />
    ),
    validator: requiredValueForDropdown,
  },
  [chartConfigOptionTypes.GIS_REGION_ID]: {
    component: ({ headers, handleConfigChange, errors, values }) => (
      <ChartConfigDropdown
        headers={headers}
        id="gis-region-id"
        label="select region id"
        title="GIS Region Id"
        handleConfigChange={handleConfigChange}
        configKey={chartConfigOptionTypes.GIS_REGION_ID}
        error={errors[chartConfigOptionTypes.GIS_REGION_ID]}
        value={values[chartConfigOptionTypes.GIS_REGION_ID]}
      />
    ),
    validator: requiredValueForDropdown,
  },
  [chartConfigOptionTypes.GIS_MEASURE]: {
    component: ({ headers, handleConfigChange, errors, values }) => (
      <ChartConfigDropdown
        headers={headers}
        id="gis-measure"
        label="select measure"
        title="GIS Measure"
        handleConfigChange={handleConfigChange}
        configKey={chartConfigOptionTypes.GIS_MEASURE}
        error={errors[chartConfigOptionTypes.GIS_MEASURE]}
        value={values[chartConfigOptionTypes.GIS_MEASURE]}
      />
    ),
    validator: requiredValueForDropdown,
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
