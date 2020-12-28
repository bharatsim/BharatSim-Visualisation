import Box from '@material-ui/core/Box';
import React, { useContext, useEffect } from 'react';
import { fade, makeStyles } from '@material-ui/core';

import ReactGridLayout, { WidthProvider } from 'react-grid-layout';
import { useDispatch, useSelector } from 'react-redux';
import { projectLayoutContext } from '../../contexts/projectLayoutContext';
import ProjectHeader from '../../uiComponent/ProjectHeader';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import useModal from '../../hook/useModal';
import ChartConfigurationWizard from './chartConfigurationWizard/ChartConfigurationWizard';
import { getNewWidgetLayout } from '../../utils/dashboardLayoutUtils';
import CreateNewChartWidget from './CreateNewChartWidget';
import { renderWidget } from './renderWidget';
import DashboardHeader from './DashboardHeader';
import { fetchDashboard, updateDashboard as updateDashboardAction } from './actions';

const COLUMNS = 12;

const GridLayout = WidthProvider(ReactGridLayout);

const useStyles = makeStyles((theme) => {
  return {
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
  const { isOpen, closeModal, openModal } = useModal();
  const { selectedDashboardMetadata } = useContext(projectLayoutContext);
  const { name: dashboardName, _id: dashboardId } = selectedDashboardMetadata;
  const dashboard = useSelector((state) => state.dashboards.dashboards[dashboardId]);
  const autoSaveStatus = useSelector((state) => state.dashboards.autoSaveStatus[dashboardId]);
  const { layout = [], charts = [], count: chartsCount = 0 } = dashboard || {};
  const dispatch = useDispatch();

  useEffect(() => {
    if (!dashboard) {
      dispatch(fetchDashboard(dashboardId));
    }
  }, []);

  function updateDashboard(newDashboard) {
    dispatch(updateDashboardAction(newDashboard));
  }

  function onApply(chartType, config) {
    const newCharts = addChart(chartType, config);
    updateDashboard({
      charts: newCharts,
      layout,
      dashboardId,
      name: dashboardName,
      count: chartsCount + 1,
    });
    closeModal();
  }

  function addChart(chartType, config) {
    return charts.concat({
      config,
      chartType,
      layout: getNewWidgetLayout(charts.length, COLUMNS, chartsCount),
    });
  }

  function onLayoutChange(changedLayout) {
    updateDashboard({
      charts,
      layout: changedLayout,
      dashboardId,
      name: dashboardName,
      count: chartsCount,
    });
  }

  function onDeleteWidget(id) {
    updateDashboard({
      charts: charts.filter((chart) => chart.layout.i !== id),
      layout,
      dashboardId,
      name: dashboardName,
      count: chartsCount,
    });
  }

  function retrySave() {
    updateDashboard({
      charts,
      layout,
      dashboardId,
      name: dashboardName,
      count: chartsCount,
    });
  }

  if (!dashboard) {
    return null;
  }

  return (
    <Box>
      <ProjectHeader />
      <DashboardHeader
        onAddChartClick={openModal}
        dashboardName={dashboardName}
        autoSaveConfig={{ ...autoSaveStatus, onRetry: retrySave }}
        isSaveDisable={charts.length === 0}
      />
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
              return renderWidget(item, onDeleteWidget);
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
