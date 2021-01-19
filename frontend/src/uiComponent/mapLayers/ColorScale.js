import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { fade, Typography } from '@material-ui/core';

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
  legend: {
    height: theme.spacing(25),
    padding: theme.spacing(2, 1),
    background: fade(theme.palette.background.default, 0.8),
    borderRadius: theme.spacing(0.5),
    display: 'flex',
  },
  colorScale: {
    width: theme.spacing(2),
    backgroundImage: ({ colors }) => `linear-gradient(to bottom, ${colors})`,
    transform: 'rotate(180deg)',
  },
  labelScale: {
    marginLeft: theme.spacing(1),
    width: theme.spacing(4),
    position: 'relative',
  },
  label: {
    position: 'absolute',
  },
}));

function LegendScale({ scale }) {
  const colorScale = isZeroPresentAsKey(scale) ? scale : { 0: 'white', ...scale };
  const scaleColors = getScaleColor(colorScale);
  const classes = useStyles({ colors: scaleColors });

  return (
    <div className={classes.legend}>
      <div className={classes.colorScale} />
      <div className={classes.labelScale}>
        {Object.keys(colorScale).map((scalePoint) => (
          <div
            key={scalePoint}
            style={{ top: `calc(${(1 - scalePoint) * 100}% - ${HALF_OF_SCALE_LABEL_POINT_SIZE})` }}
            className={classes.label}
          >
            <Typography variant="body2">{Number(scalePoint).toFixed(2)}</Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

LegendScale.propTypes = {
  scale: PropTypes.shape({}).isRequired,
};

export default LegendScale;
