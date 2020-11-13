import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import ChartConfigurationHeader from './ChartConfigurationHeader';
import ChartSelectorStep from './ChartSelectorStep';
import ChartConfigSelectorStep from './ChartConfigSelectorStep';

const useDrawerStyles = makeStyles((theme) => ({
  paper: {
    width: '45vw',
    borderRadius: theme.spacing(1),
    marginTop: '64px',
    height: 'calc(100vh - 64px)',
  },
}));

function ChartConfigurationWizard({ isOpen, closeModal }) {
  const drawerClasses = useDrawerStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedChart, setSelectedChart] = useState('');

  function goToNextStep() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  function onClickOfChartSelectorNext(chart) {
    setSelectedChart(chart);
    goToNextStep();
  }

  return (
    <Drawer anchor="right" open={isOpen} onClose={closeModal} classes={drawerClasses}>
      <Box m={6}>
        <ChartConfigurationHeader closeModal={closeModal} chart={selectedChart} />
        {activeStep === 0 && (
          <ChartSelectorStep onNext={onClickOfChartSelectorNext} chart={selectedChart} />
        )}
        {activeStep === 1 && <ChartConfigSelectorStep />}
      </Box>
    </Drawer>
  );
}

ChartConfigurationWizard.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ChartConfigurationWizard;