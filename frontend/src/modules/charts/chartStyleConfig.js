import { chartColorsPallet, colors } from '../../theme/colorPalette';

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

const font = {
  family: 'Roboto',
  size: 10,
  weight: 400,
};

const marker = {
  size: 4,
  symbol: 'circle',
  opacity: 1,
};

const line = {
  size: 1,
  opacity: 1,
};

const tooltip = (color) => ({
  hoverlabel: {
    bgcolor: '#fff',
    bordercolor: color,
    font: {
      color: '#000',
    },
  },
  hoverinfo: 'x+y',
  hovertemplate: '%{fullData.name}: %{y}<extra></extra>',
});

const axisStyles = {
  color: colors.grayScale['400'],
  zerolinecolor: colors.grayScale['200'],
  linewidth: 0.5,
  gridwidth: 0.5,
  zerolinewidth: 0.5,
};

function plotlyChartLayoutConfig(xColumn) {
  return {
    legend: {
      x: 0.5,
      y: -0.2,
      orientation: 'h',
      margin: { l: 0, r: 0, b: 0, t: 0 },
      xanchor: 'center',
      font: {
        color: colors.grayScale['400'],
        ...font,
        size: 12,
      },
    },
    colorway: chartColorsPallet[1],
    autosize: true,
    margin: {
      l: 32,
      r: 0,
      b: 60,
      t: 20,
    },
    font,
    xaxis: {
      title: { text: xColumn, standoff: 8, font: { ...font, weight: 700, size: 14 } },
      showline: true,
      tickwidth: 1,
      tick0: 0,
      automargin: false,
      autotypenumbers: 'strict',
      ...axisStyles,
    },
    yaxis: {
      title: { standoff: 8 },
      ticklabelposition: 'outside',
      showline: true,
      tickwidth: 1,
      tick0: 0,
      automargin: false,
      ...axisStyles,
    },
  };
}

export { chartStyleConfig, plotlyChartLayoutConfig, plotlyConfigOptions, line, marker, tooltip };
