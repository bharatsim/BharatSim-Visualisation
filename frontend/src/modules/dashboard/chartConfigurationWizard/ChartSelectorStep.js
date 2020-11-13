import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dashboard } from '@material-ui/icons';
import { Box, Button, Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ImageOption from '../../../uiComponent/ImageOption';
import theme from '../../../theme/theme';

const useStyles = makeStyles(() => ({
  chartSelectorContainer: {
    height: '67vh',
    margin: theme.spacing(6, 0),
  },
}));

function ChartSelectorStep({ onNext, chart }) {
  const [selectedChart, setSelectedChart] = useState(chart);
  const classes = useStyles();
  function onChartClick(selectedChartValue) {
    setSelectedChart(selectedChartValue);
  }

  function onNextCLick() {
    onNext(selectedChart);
  }

  const isNextDisable = !selectedChart;

  return (
    <Box mt={2}>
      <Divider />
      <Box px={2} py={4}>
        <Typography variant="subtitle1">
          Choose a chart type to start configuring your chart
        </Typography>
        <Box className={classes.chartSelectorContainer}>
          <Box mb={2}>
            <Typography variant="subtitle2">LineChart</Typography>
          </Box>
          <Box>
            <ImageOption
              value="Line Chart"
              label="Line Chart"
              icon={<Dashboard />}
              isSelected={selectedChart === 'Line Chart'}
              onCLick={onChartClick}
            />
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={onNextCLick}
          disabled={isNextDisable}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

ChartSelectorStep.defaultProps = {
  chart: '',
};

ChartSelectorStep.propTypes = {
  onNext: PropTypes.func.isRequired,
  chart: PropTypes.string,
};

export default ChartSelectorStep;
