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
import AnnotationConfig from '../modules/chartConfigOptions/AnnotationConfig';
import LineChartSeriesStyles from '../modules/chartConfigOptions/LineChartSeriesStyles';
import HistogramStyleConfig from '../modules/chartConfigOptions/HistogramStyles';
import BarChartSeriesStyles from '../modules/chartConfigOptions/BarChartSeriesStyle';
import AxisConfig from '../modules/chartConfigOptions/AxisConfig';

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
        label="Select metric"
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
        label="Select region id"
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
        label="Select measure"
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
  [chartConfigOptionTypes.MEASURE]: {
    component: ({ headers }) => (
      <HeaderSelector
        headers={headers}
        id="measure"
        label="Select measure"
        title="Measure/Metrics"
        configKey={chartConfigOptionTypes.MEASURE}
      />
    ),
  },
  [chartConfigOptionTypes.ANNOTATION]: {
    component: () => <AnnotationConfig configKey={chartConfigOptionTypes.ANNOTATION} />,
  },
  [chartConfigOptionTypes.LINE_CHART_SERIES_STYLE]: {
    component: () => (
      <LineChartSeriesStyles
        seriesConfigKey={`${chartConfigOptionTypes.Y_AXIS}`}
        title="Series"
        configKey="yAxisStyles"
      />
    ),
  },
  [chartConfigOptionTypes.BAR_CHART_SERIES_STYLE]: {
    component: () => (
      <BarChartSeriesStyles
        seriesConfigKey={chartConfigOptionTypes.Y_AXIS}
        title="Series"
        configKey="yAxisStyles"
      />
    ),
  },
  [chartConfigOptionTypes.HISTOGRAM_CHART_SERIES_STYLE]: {
    component: () => (
      <HistogramStyleConfig seriesConfigKey={chartConfigOptionTypes.MEASURE} title="Series" />
    ),
  },
  [chartConfigOptionTypes.X_AXIS_CONFIG]: {
    component: () => (
      <AxisConfig
        title="X Axis"
        configKey={chartConfigOptionTypes.X_AXIS_CONFIG}
        axis={`${chartConfigOptionTypes.X_AXIS}.columnName`}
      />
    ),
  },
  [chartConfigOptionTypes.Y_AXIS_CONFIG]: {
    component: () => <AxisConfig title="Y Axis" configKey={chartConfigOptionTypes.Y_AXIS_CONFIG} />,
  },
  [chartConfigOptionTypes.HISTOGRAM_AXIS_CONFIG]: {
    component: () => (
      <AxisConfig
        title="Measure"
        configKey={chartConfigOptionTypes.X_AXIS_CONFIG}
        axis={`${chartConfigOptionTypes.MEASURE}`}
      />
    ),
  },
};

export default chartConfigOptions;
