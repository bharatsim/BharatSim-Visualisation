import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

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
    padding: theme.spacing(1),
    background: theme.palette.background.default,
    borderRadius: theme.spacing(0.5),
    display: 'flex',
  },
  colorScale: {
    width: theme.spacing(2),
    backgroundImage: ({ colors }) => `linear-gradient(to bottom, ${colors})`,
  },
  labelScale: {
    marginLeft: theme.spacing(1),
    width: theme.spacing(4),
    height: `calc(100% - ${theme.spacing(2)}px)`,
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
          <div key={scalePoint} style={{ top: `${scalePoint * 100}%` }} className={classes.label}>
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
