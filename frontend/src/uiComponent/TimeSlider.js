import React, { useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { timeIntervalStrategies } from '../constants/sliderConfigs';

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.spacing(15),
  },
}));

function getUniqueTimeMarks(data, minValue, maxValue) {
  const uniqueValues = [...new Set(data)];
  return uniqueValues.map((timeValue) => {
    if ([minValue, maxValue].includes(timeValue)) {
      return { value: timeValue, label: timeValue === minValue ? minValue : maxValue };
    }
    return { value: timeValue };
  });
}

function getMarksForContinuesValue(min, max, stepSize) {
  const numberedStepSize = Number(stepSize);
  const values = [
    { value: min, label: min },
    { value: max, label: max },
  ];
  for (let value = min + numberedStepSize; value < max; value += numberedStepSize) {
    values.push({ value });
  }
  return values;
}

export default function TimeSlider({
  data,
  setTimeSliderValue,
  title,
  timeSliderValue,
  sliderConfig,
}) {
  const classes = useStyles();

  const { strategy, stepSize } = sliderConfig;

  const { marks, min, max } = useMemo(() => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);

    if (strategy === timeIntervalStrategies.DEFAULT_INTERVALS) {
      const uniqueMarks = getUniqueTimeMarks(data, minValue, maxValue);
      return { marks: uniqueMarks, min: minValue, max: maxValue };
    }
    const marksValue = getMarksForContinuesValue(minValue, maxValue, stepSize);

    return {
      min: minValue,
      max: maxValue,
      marks: marksValue,
    };
  }, [data, strategy, stepSize]);

  function onChange(e, value) {
    setTimeSliderValue(value);
  }

  useEffect(() => {
    setTimeSliderValue(min);
  }, [min]);

  return (
    <div className={classes.root}>
      <Typography variant="body2">{`${title} ${timeSliderValue}`}</Typography>
      <Slider
        defaultValue={min}
        aria-labelledby="Time Slider"
        step={null}
        marks={marks}
        onChange={onChange}
        min={min}
        max={max}
        valueLabelDisplay="auto"
      />
    </div>
  );
}
TimeSlider.propTypes = {
  setTimeSliderValue: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  timeSliderValue: PropTypes.number.isRequired,
  sliderConfig: PropTypes.shape({
    strategy: PropTypes.string.isRequired,
    stepSize: PropTypes.number,
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
};
