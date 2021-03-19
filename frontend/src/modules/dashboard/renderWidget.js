/* eslint-disable react/prop-types */
import React from 'react';
import renderChart from '../charts/renderChart';
import Widget from './Widget';

export function renderWidget(chart, dashboardId, onDelete, onEdit, dashboardLayout) {
  const { layout, chartType, config } = chart;
  const updatedLayout = { ...layout, y: layout.y ? layout.y : Infinity };
  const chartId = `${updatedLayout.i}-${chartType}-${dashboardId}`;
  const chartLayout = dashboardLayout.find((l) => l.i === chartId);

  return (
    <div
      key={`${updatedLayout.i}-${chartType}-${dashboardId}`}
      data-grid={updatedLayout}
      data-testid={updatedLayout.i}
    >
      <Widget
        title={config.chartName}
        onDelete={() => onDelete(layout.i)}
        onEdit={() => onEdit(layout.i)}
        chartId={layout.i}
      >
        {renderChart(chartType, { config, layout: chartLayout })}
      </Widget>
    </div>
  );
}
