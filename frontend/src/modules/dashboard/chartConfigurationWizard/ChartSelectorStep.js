import React from 'react';
import PropTypes from 'prop-types';
import { Box, Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ImageOption from '../../../uiComponent/ImageOption';
import theme from '../../../theme/theme';
import chartConfigs from '../../../config/chartConfigs';
import { chartGroups } from '../../../constants/charts';

const useStyles = makeStyles(() => ({
  chartSelectorContainer: {
    margin: theme.spacing(6, 0),
  },
  chartTypeContainer: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginLeft: theme.spacing(6),
    },
    '& > :first-child': {
      marginLeft: theme.spacing(0),
    },
  },
}));

function ChartSelectorStep({ onNext }) {
  const classes = useStyles();
  function onChartClick(selectedChartValue) {
    onNext(selectedChartValue);
  }

  return (
    <Box mt={2}>
      <Divider />
      <Box px={2} py={4}>
        <Typography variant="subtitle1">
          Choose a chart type to start configuring your chart
        </Typography>
        <Box className={classes.chartSelectorContainer}>
          {Object.keys(chartGroups).map((chartGroupName) => (
            <Box mb={6} key={chartGroupName}>
              <Box mb={2}>
                <Typography variant="subtitle2">{chartGroupName}</Typography>
              </Box>
              <Box className={classes.chartTypeContainer}>
                {chartGroups[chartGroupName].map((chartType) => {
                  const chartConfig = chartConfigs[chartType];
                  return (
                    <ImageOption
                      key={chartConfig.key}
                      dataTestId={chartConfig.key}
                      value={chartConfig.key}
                      label={chartConfig.label}
                      icon={<img src={chartConfig.icon} alt={chartConfig.key} />}
                      onCLick={onChartClick}
                    />
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

ChartSelectorStep.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default ChartSelectorStep;
