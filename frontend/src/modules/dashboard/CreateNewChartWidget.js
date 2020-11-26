import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import { Button, fade } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import newChartWidgetIcon from '../../assets/images/newChartWidget.svg';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    borderColor: fade(theme.colors.primaryColorScale['500'], 0.24),
    border: '1px solid',
    padding: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.spacing(1),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

function CreateNewChartWidget({ openChartConfig }) {
  const classes = useStyles();
  return (
    <Box className={classes.mainContainer}>
      <img src={newChartWidgetIcon} alt="newChartWidgetIcon" />
      <Box mt={2} className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={openChartConfig}
          data-testid="button-add-chart-widget"
        >
          Add Chart
        </Button>
      </Box>
    </Box>
  );
}

CreateNewChartWidget.propTypes = {
  openChartConfig: PropTypes.func.isRequired,
};

export default CreateNewChartWidget;
