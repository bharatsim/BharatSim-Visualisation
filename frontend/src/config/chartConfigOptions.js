/* eslint-disable react/prop-types */
import React from 'react';
import YAxisChartConfig from '../modules/chartConfigOptions/YAxisChartConfig';
import { chartConfigOptionTypes } from '../constants/chartConfigOptionTypes';
import GeoDimensionsConfig from '../modules/chartConfigOptions/GeoDimensionsConfig';
import HeaderSelector from '../modules/chartConfigOptions/HeaderSelector';
import TimeSliderConfig from '../modules/chartConfigOptions/TimeSliderConfig';
import ChoroplethConfigs from '../modules/chartConfigOptions/ChoroplethConfigs';
import MapLayerSelector from '../modules/chartConfigOptions/MapLayerSelector';
import XAxisConfig from '../modules/chartConfigOptions/XAxisConfig';

const chartConfigOptions = {
  [chartConfigOptionTypes.X_AXIS]: {
    component: ({ headers }) => (
      <XAxisConfig headers={headers} configKey={chartConfigOptionTypes.X_AXIS} />
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
      <HeaderSelector
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
      <HeaderSelector
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
      <HeaderSelector
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
