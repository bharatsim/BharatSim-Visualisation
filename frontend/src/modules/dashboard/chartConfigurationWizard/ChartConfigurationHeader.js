import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Close } from '@material-ui/icons';
import chartConfigs from '../../../config/chartConfigs';
import IconButton from '../../../uiComponent/IconButton';

const useStyles = makeStyles((theme) => {
  return {
    imageContainer: {
      height: theme.spacing(8),
      width: theme.spacing(8),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primaryColorScale['50'],
      borderColor: theme.palette.grey['100'],
      border: '1px solid',
      marginRight: theme.spacing(3),
      borderRadius: theme.spacing(1),
    },
    image: {
      width: theme.spacing(6),
    },
    chartName: {
      color: theme.palette.text.secondary,
    },
  };
});

function ChartConfigurationHeader({ closeModal, chart, activeStep }) {
  const classes = useStyles();
  return (
    <Box pl={2} display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center">
        <Typography variant="h6">Chart Configuration Wizard</Typography>
        {chart && activeStep !== 0 && (
          <Box px={6} display="flex" alignItems="center">
            <Box className={classes.imageContainer}>
              <img src={chartConfigs[chart].icon} alt={chart} className={classes.image} />
            </Box>
            <Typography variant="body2" classes={{ root: classes.chartName }}>
              {chartConfigs[chart].label}
            </Typography>
          </Box>
        )}
      </Box>
      <IconButton onClick={closeModal} data-testid="close-wizard">
        <Close />
      </IconButton>
    </Box>
  );
}

ChartConfigurationHeader.defaultProps = {
  chart: '',
};

ChartConfigurationHeader.propTypes = {
  activeStep: PropTypes.number.isRequired,
  chart: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
};

export default ChartConfigurationHeader;
