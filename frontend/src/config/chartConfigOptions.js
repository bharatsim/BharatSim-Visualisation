/* eslint-disable react/prop-types */
import React from 'react';
import YAxisChartConfig from '../modules/chartConfigOptions/YAxisChartConfig';
import { chartConfigOptionTypes } from '../constants/chartConfigOptionTypes';
import GeoDimensionsConfig from '../modules/chartConfigOptions/GeoDimensionsConfig';
import ChartConfigDropdown from '../modules/chartConfigOptions/ChartConfigDropdown';
import TimeSliderConfig from '../modules/chartConfigOptions/TimeSliderConfig';
import ChoroplethConfigs from '../modules/chartConfigOptions/CholoroplethConfigs';
import MapLayerSelector from '../modules/chartConfigOptions/MapLayerSelector';

const chartConfigOptions = {
  [chartConfigOptionTypes.X_AXIS]: {
    component: ({ headers }) => (
      <ChartConfigDropdown
        headers={headers}
        id="x-axis-dropdown"
        label="select x axis"
        title="X-axis"
        configKey={chartConfigOptionTypes.X_AXIS}
      />
    ),
  },
  [chartConfigOptionTypes.Y_AXIS]: {
    component: ({ headers }) => (
      <YAxisChartConfig
        headers={headers}
        handleConfigChange={headers}
        configKey={chartConfigOptionTypes.Y_AXIS}
      />
    ),
  },

  [chartConfigOptionTypes.GEO_DIMENSIONS]: {
    component: ({ headers }) => (
      <GeoDimensionsConfig headers={headers} configKey={chartConfigOptionTypes.GEO_DIMENSIONS} />
    ),
  },

  [chartConfigOptionTypes.GEO_METRIC_SERIES]: {
    component: ({ headers }) => (
      <ChartConfigDropdown
        headers={headers}
        id="dropdown-geo-metric-series"
        label="select metric"
        title="Geo Metric"
        configKey={chartConfigOptionTypes.GEO_METRIC_SERIES}
      />
    ),
  },
  [chartConfigOptionTypes.GIS_SHAPE_LAYER]: {
    component: () => <MapLayerSelector />,
  },
  [chartConfigOptionTypes.GIS_REGION_ID]: {
    component: ({ headers }) => (
      <ChartConfigDropdown
        headers={headers}
        id="gis-region-id"
        label="select region id"
        title="GIS Region Id"
        configKey={chartConfigOptionTypes.GIS_REGION_ID}
      />
    ),
  },
  [chartConfigOptionTypes.GIS_MEASURE]: {
    component: ({ headers }) => (
      <ChartConfigDropdown
        headers={headers}
        id="gis-measure"
        label="select measure"
        title="Measure/Metrics"
        configKey={chartConfigOptionTypes.GIS_MEASURE}
      />
    ),
  },
  [chartConfigOptionTypes.SLIDER_CONFIG]: {
    component: ({ headers }) => (
      <TimeSliderConfig headers={headers} configKey={chartConfigOptionTypes.SLIDER_CONFIG} />
    ),
  },

  [chartConfigOptionTypes.CHOROPLETH_CONFIG]: {
    component: ({ headers }) => (
      <ChoroplethConfigs headers={headers} configKey={chartConfigOptionTypes.CHOROPLETH_CONFIG} />
    ),
  },
};

export default chartConfigOptions;
