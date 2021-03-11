import React from 'react';
import { chartTypes } from '../constants/charts';
import LineChart from '../modules/charts/lineChart/LineChart';
import { chartConfigOptionTypes } from '../constants/chartConfigOptionTypes';
import lineChartIcon from '../assets/images/lineChart.svg';
import barChartIcon from '../assets/images/barChart.svg';
import heatMapIcon from '../assets/images/heatmap.svg';
import BarChart from '../modules/charts/barChart/BarChart';
import HeatMap from '../modules/charts/GeoMap/HeatMap';
import Choropleth from '../modules/charts/GeoMap/Choropleth';
import Histogram from '../modules/charts/histogram/Histogram';

const chartConfigs = {
  [chartTypes.LINE_CHART]: {
    key: chartTypes.LINE_CHART,
    label: 'Line Chart',
    icon: lineChartIcon,
    chart: (chartProps) => <LineChart {...chartProps} />,
    configOptions: [chartConfigOptionTypes.X_AXIS, chartConfigOptionTypes.Y_AXIS],
  },
  [chartTypes.BAR_CHART]: {
    key: chartTypes.BAR_CHART,
    label: 'Bar Chart',
    icon: barChartIcon,
    chart: (chartProps) => <BarChart {...chartProps} />,
    configOptions: [chartConfigOptionTypes.X_AXIS, chartConfigOptionTypes.Y_AXIS],
  },
  [chartTypes.HEAT_MAP]: {
    key: chartTypes.HEAT_MAP,
    label: 'Heatmap',
    icon: heatMapIcon,
    chart: (chartProps) => <HeatMap {...chartProps} />,
    configOptions: [
      chartConfigOptionTypes.GEO_DIMENSIONS,
      chartConfigOptionTypes.GEO_METRIC_SERIES,
      chartConfigOptionTypes.SLIDER_CONFIG,
    ],
  },
  [chartTypes.CHOROPLETH_MAP]: {
    key: chartTypes.CHOROPLETH_MAP,
    label: 'Choropleth',
    icon: heatMapIcon,
    chart: (chartProps) => <Choropleth {...chartProps} />,
    configOptions: [
      chartConfigOptionTypes.GIS_MEASURE,
      chartConfigOptionTypes.CHOROPLETH_CONFIG,
      chartConfigOptionTypes.SLIDER_CONFIG,
    ],
  },
  [chartTypes.HISTOGRAM]: {
    key: chartTypes.HISTOGRAM,
    label: 'Histogram',
    icon: barChartIcon,
    chart: (chartProps) => <Histogram {...chartProps} />,
    configOptions: [chartConfigOptionTypes.MEASURE],
  },
};

export default chartConfigs;
