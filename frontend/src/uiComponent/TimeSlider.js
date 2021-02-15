import React, { useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import PropTypes from 'prop-types';
import { timeIntervalStrategies } from '../constants/sliderConfigs';
import ValueLabel from './ValueLabel';

const useStyles = makeStyles({
  root: {
    height: 'auto',
  },
});

function ValueLabelComponent({ children, open, value }) {
  return (
    <ValueLabel open={open} value={value}>
      {children}
    </ValueLabel>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};

function getUniqueTimeMarks(data, minValue, maxValue) {
  const uniqueValues = [...new Set(data)];
  const sortedArray = uniqueValues.sort((v1, v2) => v1 - v2);
  return sortedArray.map((timeValue) => {
    if ([minValue, maxValue].includes(timeValue)) {
      return { value: timeValue, label: timeValue };
    }
    return { value: timeValue };
  });
}

function getMarksForContinuesValue(min, max, stepSize) {
  const numberedStepSize = Number(stepSize);
  const values = [{ value: min, label: min }];
  for (let value = min + numberedStepSize; value < max; value += numberedStepSize) {
    values.push({ value });
  }
  values.push({ value: max, label: max });
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
  }, [min, strategy, stepSize]);

  return (
    <div className={classes.root}>
      <Slider
        defaultValue={min}
        aria-labelledby="Time Slider"
        step={null}
        marks={marks}
        onChange={onChange}
        min={min}
        max={max}
        value={timeSliderValue}
        ValueLabelComponent={ValueLabelComponent}
        valueLabelDisplay="on"
        valueLabelFormat={() => `${title}: ${timeSliderValue}`}
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
