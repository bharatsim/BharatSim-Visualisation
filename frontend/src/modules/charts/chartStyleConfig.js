import { chartColors } from '../../theme/colorPalette';

const chartStyleConfig = {
  fill: false,
  borderWidth: 1,
  pointBorderWidth: 1,
  pointRadius: 1,
  pointHitRadius: 10,
};

const plotlyConfigOptions = {
  modeBarButtonsToRemove: ['select2d', 'lasso2d', 'toImage'],
  displaylogo: false,
};

function plotlyChartLayoutConfig(xColumn) {
  return {
    legend: {
      x: 0.5,
      y: -0.2,
      orientation: 'h',
      margin: { l: 0, r: 0, b: 0, t: 0 },
      xanchor: 'center',
    },
    colorway: chartColors,
    autosize: true,
    margin: {
      l: 50,
      r: 0,
      b: 50,
      t: 20,
    },
    xaxis: {
      title: { text: xColumn, standoff: 10 },
      // rangemode: 'tozero',
      showline: true,
      tickwidth: 1,
      tick0: 0,
      automargin: false,
      autotypenumbers: 'strict',
    },
    yaxis: {
      title: { standoff: 10 },
      // rangemode: 'tozero',
      ticklabelposition: 'outside',
      showline: true,
      tickwidth: 1,
      tick0: 0,
      automargin: false,
    },
  };
}

export { chartStyleConfig, plotlyChartLayoutConfig, plotlyConfigOptions };
