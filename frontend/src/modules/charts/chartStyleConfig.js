import { withStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { addDays, differenceInDays } from 'date-fns';
import { chartColorsPallet, colors } from '../../theme/colorPalette';
import { annotationTypes, areaAnnotationDirection } from '../../constants/annotations';

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

function getLabelPosition(start, end, type) {
  if (type === annotationTypes.NUMERIC) {
    return Number(start) + Math.abs(end - start) / 2;
  }
  const date1 = new Date(end);
  const date2 = new Date(start);
  const difference = differenceInDays(date1, date2) / 2;
  return addDays(date2, difference);
}

function createAnnotation(annotations, annotationToggle) {
  return annotationToggle
    ? {
        shapes: [
          ...annotations.map(({ direction, type, date, numeric, color, opacity }) => {
            const { start, end } = type === annotationTypes.DATE ? date : numeric;
            return direction === areaAnnotationDirection.VERTICAL
              ? createVerticalRect({ start, end, color, opacity })
              : createHorizontalRect({ start, end, color, opacity });
          }),
        ],
        annotations: [
          ...annotations
            .filter(({ label }) => !!label)
            .map(({ direction, label, numeric, date, type }) => {
              const { start, end } = type === annotationTypes.DATE ? date : numeric;
              const labelPosition = getLabelPosition(start, end, type);
              return direction === areaAnnotationDirection.VERTICAL
                ? createVerticalAnnotationLabel(labelPosition, label)
                : createHorizontalAnnotationLabel(labelPosition, label);
            }),
        ],
      }
    : {};
}

function layoutConfig(
  xColumn,
  xAxisType,
  yAxisType,
  annotations = [],
  annotationToggel = false,
  revision,
) {
  return {
    showlegend: true,
    colorway: chartColorsPallet[1],
    autosize: true,
    width: undefined,
    height: undefined,
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
    datarevision: revision,
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
    ...createAnnotation(annotations, annotationToggel),
  };
}

function createVerticalAnnotationLabel(position, label) {
  return {
    x: position,
    y: 0.99,
    xref: 'x',
    yref: 'paper',
    text: label,
    showarrow: false,
    xanchor: 'center',
    yanchor: 'auto',
  };
}

function createHorizontalAnnotationLabel(position, label) {
  return {
    x: 0,
    y: position,
    xref: 'paper',
    yref: 'x',
    text: label,
    showarrow: false,
    xanchor: 'auto',
    yanchor: 'center',
  };
}

function createVerticalRect({ start, end, color, opacity }) {
  return {
    type: 'rect',
    xref: 'x',
    yref: 'paper',
    x0: start,
    y0: 0,
    x1: end,
    y1: 1,
    fillcolor: color,
    opacity,
    line: {
      width: 0,
    },
  };
}

function createHorizontalRect({ start, end, color, opacity }) {
  return {
    type: 'rect',
    xref: 'paper',
    yref: 'y',
    x0: 0,
    y0: start,
    x1: 1,
    y1: end,
    fillcolor: color,
    opacity,
    line: {
      width: 0,
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
