/* eslint-disable react/prop-types */
import React from 'react';
import renderChart from '../charts/renderChart';
import Widget from './Widget';

export function renderWidget(chart, onDelete) {
  const { layout, chartType, config } = chart;
  const updatedLayout = { ...layout, y: layout.y ? layout.y : Infinity };
  return (
    <div key={updatedLayout.i} data-grid={updatedLayout} data-testid={updatedLayout.i}>
      <Widget title={config.chartName} onDelete={() => onDelete(layout.i)} chartId={layout.i}>
        {renderChart(chartType, { config })}
      </Widget>
    </div>
  );
}
