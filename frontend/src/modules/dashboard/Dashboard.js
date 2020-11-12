import Box from '@material-ui/core/Box';
import React, { useContext } from 'react';
import { fade, makeStyles, Typography } from '@material-ui/core';
import { projectLayoutContext } from '../../contexts/projectLayoutContext';
import ProjectHeader from '../../uiComponent/ProjectHeader';

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
  };
});

function Dashboard() {
  const { selectedDashboardMetadata } = useContext(projectLayoutContext);
  const classes = useStyles();
  const { name: dashboardName } = selectedDashboardMetadata;
  return (
    <Box>
      <ProjectHeader />
      <Box className={classes.dashboardHeader}>
        <Typography variant="h6">{dashboardName}</Typography>
      </Box>
    </Box>
  );
}

export default Dashboard;
