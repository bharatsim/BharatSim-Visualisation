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
    marginTop: theme.spacing(16),
    height: `calc(100vh - ${theme.spacing(16)}px)`,
  },
}));

function ChartConfigurationWizard({ isOpen, closeModal, onApply }) {
  const drawerClasses = useDrawerStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedChart, setSelectedChart] = useState('');

  function goToNextStep() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  function goToChartSelectorStep() {
    setActiveStep(0);
  }

  function onClickOfChartSelectorNext(chart) {
    setSelectedChart(chart);
    goToNextStep();
  }
  function onClickOfConfigSelectorNext(config) {
    onApply(selectedChart, config);
  }

  return (
    <Drawer anchor="right" open={isOpen} onClose={closeModal} classes={drawerClasses}>
      <Box m={6}>
        <ChartConfigurationHeader
          closeModal={closeModal}
          chart={selectedChart}
          activeStep={activeStep}
        />
        <Box>
          {activeStep === 0 && <ChartSelectorStep onNext={onClickOfChartSelectorNext} />}
          {activeStep === 1 && (
            <ChartConfigSelectorStep
              chartType={selectedChart}
              onApply={onClickOfConfigSelectorNext}
              backToChartType={goToChartSelectorStep}
            />
          )}
        </Box>
      </Box>
    </Drawer>
  );
}

ChartConfigurationWizard.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

export default ChartConfigurationWizard;
