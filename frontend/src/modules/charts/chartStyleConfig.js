import { withStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { chartColorsPallet, colors } from '../../theme/colorPalette';

const configs = {
  modeBarButtonsToRemove: ['select2d', 'lasso2d', 'toImage'],
  displaylogo: false,
  responsive: true,
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

const tooltip = (yCol, color) => ({
  hoverlabel: {
    bgcolor: '#fff',
    bordercolor: color,
    font: {
      color: '#000',
    },
  },
  hoverinfo: 'x+y',
  hovertemplate: `${yCol}: %{y}<extra></extra>`,
});

const axisStyles = {
  color: colors.grayScale['400'],
  zerolinecolor: colors.grayScale['200'],
  linewidth: 0.5,
  gridwidth: 0.5,
  zerolinewidth: 0.5,
  showline: true,
  tickwidth: 1,
  automargin: true,
  autotypenumbers: 'strict',
};

function layoutConfig(xColumn, xAxisType, yAxisType) {
  return {
    showlegend: true,
    colorway: chartColorsPallet[1],
    autosize: true,
    font,
    margin: {
      l: 32,
      r: 0,
      b: 60,
      t: 40,
      autoexpand: true,
    },
    legend: {
      font: {
        color: colors.grayScale['400'],
        ...font,
        size: 12,
      },
    },
    xaxis: {
      type: xAxisType,
      title: { text: xColumn, standoff: 8, font: { ...font, weight: 700, size: 14 } },
      ...axisStyles,
    },
    yaxis: {
      title: { standoff: 8 },
      ticklabelposition: 'outside',
      type: yAxisType,
      ...axisStyles,
    },
  };
}

function yAxisLegendName(yColName) {
  const maxLength = 15;
  const ellipsisLength = 3;
  return yColName.length > maxLength
    ? `${yColName.slice(0, maxLength - ellipsisLength)}...`
    : yColName;
}

const ChartFullSizeWrapper = withStyles(() => ({
  root: {
    height: '100%',
    width: '100%',
    position: 'relative',
    padding: 0,
  },
}))(Box);

export { layoutConfig, configs, line, marker, tooltip, yAxisLegendName, ChartFullSizeWrapper };
