/* eslint-disable react/prop-types */
import React from 'react';
import renderChart from '../charts/renderChart';
import Widget from './Widget';

export function renderWidget({ layout, chartType, config }) {
  const updatedLayout = { ...layout, y: layout.y ? layout.y : Infinity };
  return (
    <div key={updatedLayout.i} data-grid={updatedLayout} data-testid={updatedLayout.i}>
      <Widget title={config.chartName}>{renderChart(chartType, { config })}</Widget>
    </div>
  );
}
