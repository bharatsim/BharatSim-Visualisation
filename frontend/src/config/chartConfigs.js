import React from 'react';
import { chartTypes } from '../constants/charts';
import LineChart from '../modules/charts/lineChart/LineChart';
import { chartConfigOptionTypes } from '../constants/chartConfigOptionTypes';
import lineChartIcon from '../assets/images/lineChart.svg';
import barChartIcon from '../assets/images/barChart.svg';
import BarChart from '../modules/charts/barChart/BarChart';

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
};

export default chartConfigs;
