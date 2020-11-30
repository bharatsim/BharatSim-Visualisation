import Box from '@material-ui/core/Box';
import React, { useContext, useEffect, useState } from 'react';
import { fade, makeStyles, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import ReactGridLayout, { WidthProvider } from 'react-grid-layout';
import { useSnackbar } from 'notistack';
import { projectLayoutContext } from '../../contexts/projectLayoutContext';
import ProjectHeader from '../../uiComponent/ProjectHeader';
import DashboardHeaderBar from '../../uiComponent/DashboardHeaderBar';

import addChartIcon from '../../assets/images/addchart.svg';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import useModal from '../../hook/useModal';
import ChartConfigurationWizard from './chartConfigurationWizard/ChartConfigurationWizard';
import { getNewWidgetLayout } from '../../utils/dashboardLayoutUtils';
import CreateNewChartWidget from './CreateNewChartWidget';
import { renderWidget } from './renderWidget';
import { api } from '../../utils/api';
import useFetch from '../../hook/useFetch';
import snackbarVariant from '../../constants/snackbarVariant';

const COLUMNS = 12;

const GridLayout = WidthProvider(ReactGridLayout);

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
    gridContainer: {
      height: `calc(100vh - ${theme.spacing(40)}px)`,
      overflowY: 'scroll',
    },
  };
});

function Dashboard() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { SUCCESS } = snackbarVariant;
  const { isOpen, closeModal, openModal } = useModal();

  const { selectedDashboardMetadata } = useContext(projectLayoutContext);
  const { name: dashboardName, _id: dashboardId } = selectedDashboardMetadata;
  const { data: fetchedDashboard } = useFetch(api.getDashboard, [dashboardId], !!dashboardId);

  const [layout, setLayout] = useState([]);
  const [charts, setCharts] = useState([]);
  const [chartsCount, setChartsCount] = useState(0);

  useEffect(() => {
    if (fetchedDashboard) {
      const { dashboard } = fetchedDashboard;
      const { count, charts: fetchedCharts, layout: fetchedLayout } = dashboard;
      setCharts(fetchedCharts || []);
      setLayout(fetchedLayout || []);
      setChartsCount(count || 0);
    }
  }, [fetchedDashboard]);

  function saveDashboard() {
    api
      .saveDashboard({
        charts,
        layout,
        dashboardId,
        name: dashboardName,
        count: chartsCount,
      })
      .then(() =>
        enqueueSnackbar(`Saved Successfully`, {
          variant: SUCCESS,
        }),
      );
  }
  function onApply(chartType, config) {
    addChart(chartType, config);
    setChartsCount((prevChartsCount) => prevChartsCount + 1);
    closeModal();
  }

  function addChart(chartType, config) {
    setCharts((prevCharts) => {
      return prevCharts.concat({
        config,
        chartType,
        layout: getNewWidgetLayout(prevCharts.length, COLUMNS, chartsCount),
      });
    });
  }

  function onLayoutChange(changedLayout) {
    setLayout(changedLayout);
  }
  if (!fetchedDashboard) {
    return null;
  }
  return (
    <Box>
      <ProjectHeader />
      <DashboardHeaderBar>
        <Box className={classes.dashboardHeader}>
          <Typography variant="h6">{dashboardName}</Typography>
          <Box display="flex">
            <Button
              variant="text"
              startIcon={<img src={addChartIcon} alt="add-chart" />}
              size="small"
              onClick={openModal}
              data-testid="button-add-chart-header"
            >
              Add Chart
            </Button>
            <Button variant="outlined" onClick={saveDashboard} size="small">
              Save
            </Button>
          </Box>
        </Box>
      </DashboardHeaderBar>
      <Box pt={3} className={classes.gridContainer}>
        {charts.length === 0 ? (
          <Box p={8} display="inline-flex">
            <CreateNewChartWidget openChartConfig={openModal} />
          </Box>
        ) : (
          <GridLayout
            layout={layout}
            onLayoutChange={onLayoutChange}
            className={classes.reactGridLayout}
            margin={[32, 32]}
          >
            {charts.map((item) => {
              return renderWidget(item);
            })}
          </GridLayout>
        )}
      </Box>
      {isOpen && (
        <ChartConfigurationWizard isOpen={isOpen} closeModal={closeModal} onApply={onApply} />
      )}
    </Box>
  );
}

export default Dashboard;
