export const chartTypes = {
  LINE_CHART: 'lineChart',
  BAR_CHART: 'barChart',
  PAI_CHART: 'paiChart',
  HEAT_MAP: 'heatMap',
  CHOROPLETH_MAP: 'choroplethMap',
  HISTOGRAM: 'histogram',
};

export const chartGroups = {
  'Line Chart': [chartTypes.LINE_CHART],
  'Bar Chart': [chartTypes.BAR_CHART],
  Histogram: [chartTypes.HISTOGRAM],
  'Geo Chart': [chartTypes.HEAT_MAP, chartTypes.CHOROPLETH_MAP],
};
