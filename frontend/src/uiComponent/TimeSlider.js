import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.spacing(15),
  },
}));

function valuetext(value) {
  return `Tick No. ${value}`;
}

export default function TimeSlider({
  defaultValue,
  maxValue,
  step,
  minValue,
  setTimeSliderValue,
  title,
  timeSliderValue,
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="body2">{`${title} ${timeSliderValue}`}</Typography>
      <Slider
        defaultValue={defaultValue}
        getAriaValueText={valuetext}
        aria-labelledby="Time Slider"
        step={step}
        marks
        onChange={(e, val) => setTimeSliderValue(val)}
        min={minValue}
        max={maxValue}
        valueLabelDisplay="auto"
        data-testid="time-slider"
      />
    </div>
  );
}

TimeSlider.propTypes = {
  defaultValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  minValue: PropTypes.number.isRequired,
  setTimeSliderValue: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  timeSliderValue: PropTypes.number.isRequired,
};
