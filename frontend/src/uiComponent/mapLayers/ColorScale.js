import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { fade, Typography } from '@material-ui/core';
import { formatToUnits } from '../../utils/helper';

const HALF_OF_SCALE_LABEL_POINT_SIZE = '10px';

function isZeroPresentAsKey(object) {
  return Object.keys(object).find((key) => Number(key) === 0);
}

function getScaleColor(scale) {
  return Object.keys(scale)
    .sort((v1, v2) => Number(v1) - Number(v2))
    .map((key) => `${scale[key]} ${key * 100}%`)
    .join(',');
}

const useStyles = makeStyles((theme) => ({
  scaleContainer: {
    paddingTop: theme.spacing(1),
    display: 'flex',
    height: 'calc(100% - 20px)',
  },
  legend: {
    background: fade(theme.palette.background.default, 0.8),
    borderRadius: theme.spacing(0.5),
    height: theme.spacing(25),
    padding: theme.spacing(1, 1),
    textTransform: 'capitalize',
  },
  colorScale: {
    width: theme.spacing(2),
    backgroundImage: ({ colors }) => `linear-gradient(to bottom, ${colors})`,
    transform: 'rotate(180deg)',
  },
  labelScale: {
    marginLeft: theme.spacing(1),
    width: theme.spacing(5),
    position: 'relative',
  },
  label: {
    position: 'absolute',
  },
  title: {
    maxWidth: theme.spacing(12),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '&:hover': {
      overflow: 'visible',
    },
  },
}));

function getLegendLabels(scalePoint, min, max, disablePercentageScale) {
  const label = Number(scalePoint).toFixed(2) * 100;
  if (min !== undefined && label === 0) {
    return formatToUnits(min);
  }
  if (max !== undefined && label === 100) {
    return formatToUnits(max);
  }
  if (disablePercentageScale) {
    return '';
  }
  return `${label}%`;
}

function LegendScale({ scale, title, min, max, disablePercentageScale }) {
  const colorScale = isZeroPresentAsKey(scale) ? scale : { 0: 'white', ...scale };
  const scaleColors = getScaleColor(colorScale);
  const classes = useStyles({ colors: scaleColors });

  return (
    <div className={classes.legend}>
      <Typography variant="body2" className={classes.title}>
        {title}
      </Typography>
      <div className={classes.scaleContainer}>
        <div className={classes.colorScale} />
        <div className={classes.labelScale}>
          {Object.keys(colorScale).map((scalePoint) => (
            <div
              key={scalePoint}
              style={{
                top: `calc(${(1 - scalePoint) * 100}% - ${HALF_OF_SCALE_LABEL_POINT_SIZE})`,
              }}
              className={classes.label}
            >
              <Typography variant="body2">
                {getLegendLabels(scalePoint, min, max, disablePercentageScale)}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

LegendScale.defaultProps = {
  disablePercentageScale: false,
  min: undefined,
  max: undefined,
};

LegendScale.propTypes = {
  scale: PropTypes.shape({}).isRequired,
  title: PropTypes.string.isRequired,

  min: PropTypes.number,
  max: PropTypes.number,
  disablePercentageScale: PropTypes.bool,
};

export default LegendScale;
