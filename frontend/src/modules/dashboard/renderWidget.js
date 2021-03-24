/* eslint-disable react/prop-types */
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import renderChart from '../charts/renderChart';
import Widget from './Widget';
import Error from '../loaderOrError/Error';

export function renderWidget(chart, dashboardId, onDelete, onEdit, dashboardLayout) {
  const { layout, chartType, config } = chart;
  const updatedLayout = { ...layout, y: layout.y ? layout.y : Infinity };
  const chartId = `${updatedLayout.i}-${chartType}-${dashboardId}`;
  const chartLayout = dashboardLayout.find((l) => l.i === chartId) || updatedLayout;
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
        <ErrorBoundary
          resetKeys={[config]}
          FallbackComponent={() => (
            <Error
              message="unable to plot chart, there might be some error or type mismatch with config"
              fullWidth={false}
            />
          )}
        >
          {renderChart(chartType, { config, layout: chartLayout })}
        </ErrorBoundary>
      </Widget>
    </div>
  );
}
