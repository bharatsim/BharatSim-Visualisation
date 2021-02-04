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

export default function TimeSlider({
  defaultValue,
  maxValue,
  step,
  minValue,
  setTimeSliderValue,
  title,
  timeSliderValue,
  dataTestId,
}) {
  const classes = useStyles();

  function onChange(e, value) {
    setTimeSliderValue(value);
  }

  return (
    <div className={classes.root}>
      <Typography variant="body2">{`${title} ${timeSliderValue}`}</Typography>
      <Slider
        defaultValue={defaultValue}
        aria-labelledby="Time Slider"
        step={step}
        marks
        onChange={onChange}
        min={minValue}
        max={maxValue}
        valueLabelDisplay="auto"
        data-testid={dataTestId}
      />
    </div>
  );
}

TimeSlider.defaultProps = {
  dataTestId: '',
};

TimeSlider.propTypes = {
  defaultValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  minValue: PropTypes.number.isRequired,
  setTimeSliderValue: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  timeSliderValue: PropTypes.number.isRequired,
  dataTestId: PropTypes.string,
};
