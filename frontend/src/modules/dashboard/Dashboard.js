import Box from '@material-ui/core/Box';
import React, { useContext } from 'react';
import { fade, makeStyles, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import { projectLayoutContext } from '../../contexts/projectLayoutContext';
import ProjectHeader from '../../uiComponent/ProjectHeader';
import DashboardHeaderBar from '../../uiComponent/DashboardHeaderBar';

import addChartIcon from '../../assets/images/addchart.svg';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import useModal from '../../hook/useModal';
import ChartConfigurationWizard from './chartConfigurationWizard/ChartConfigurationWizard';

const useStyles = makeStyles((theme) => {
  return {
    dashboardHeader: {
      width: '100%',
      display: 'flex',
      height: theme.spacing(12),
      justifyContent: 'space-between',
      backgroundColor: fade(theme.colors.grayScale['100'], 0.5),
      alignItems: 'center',
      padding: theme.spacing(3, 8),
    },
    reactGridLayout: {
      background: theme.palette.background.default,
      minHeight: theme.spacing(75),
      '& .react-grid-item': {
        background: theme.palette.background.paper,
        border: '1px solid',
        borderColor: fade(theme.colors.primaryColorScale['500'], 0.24),
        borderRadius: theme.spacing(1),
      },
    },
  };
});

function Dashboard() {
  const classes = useStyles();
  const { selectedDashboardMetadata } = useContext(projectLayoutContext);
  const { name: dashboardName } = selectedDashboardMetadata;

  const { isOpen, closeModal, openModal } = useModal();
  return (
    <Box>
      <ProjectHeader />
      <DashboardHeaderBar>
        <Box className={classes.dashboardHeader}>
          <Typography variant="h6">{dashboardName}</Typography>
          <Button
            variant="text"
            startIcon={<img src={addChartIcon} alt="add-chart" />}
            size="small"
            onClick={openModal}
          >
            Add Chart
          </Button>
        </Box>
      </DashboardHeaderBar>
      {isOpen && <ChartConfigurationWizard isOpen={isOpen} closeModal={closeModal} />}
    </Box>
  );
}

export default Dashboard;
