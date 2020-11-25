import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ImageOption from '../../../uiComponent/ImageOption';
import theme from '../../../theme/theme';
import chartConfigs from '../../../config/chartConfigs';
import { useFooterStyles } from './styles';

const useStyles = makeStyles(() => ({
  chartSelectorContainer: {
    margin: theme.spacing(6, 0),
  },
}));

function ChartSelectorStep({ onNext, chart }) {
  const classes = useStyles();
  const footerClasses = useFooterStyles();
  const [selectedChart, setSelectedChart] = useState(chart);
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
          {Object.values(chartConfigs).map((chartConfig) => {
            return (
              <Box key={chartConfig.label}>
                <Box mb={2}>
                  <Typography variant="subtitle2">{chartConfig.label}</Typography>
                </Box>
                <Box>
                  <ImageOption
                    dataTestId={chartConfig.key}
                    value={chartConfig.key}
                    label={chartConfig.label}
                    icon={<img src={chartConfig.icon} alt={chartConfig.key} />}
                    isSelected={selectedChart === chartConfig.key}
                    onCLick={onChartClick}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box className={footerClasses.footer}>
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
