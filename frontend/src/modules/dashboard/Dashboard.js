import Box from '@material-ui/core/Box';
import React, { useContext, useEffect, useState } from 'react';
import { fade, makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout';
import { useDispatch, useSelector } from 'react-redux';
import produce from 'immer';
import { projectLayoutContext } from '../../contexts/projectLayoutContext';
import ProjectHeader from '../../uiComponent/ProjectHeader';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import useModal from '../../hook/useModal';
import ChartConfigurationWizard from './chartConfigurationWizard/ChartConfigurationWizard';
import { createLayout, createWidgetId, getNewWidgetLayout } from '../../utils/dashboardLayoutUtils';
import CreateNewChartWidget from './CreateNewChartWidget';
import { renderWidget } from './renderWidget';
import DashboardHeader from './DashboardHeader';
import { fetchDashboard, updateDashboard as updateDashboardAction } from './actions';
import { api } from '../../utils/api';
import NotesModal from './NotesModal';

const COLUMNS = 12;
const ROW_HEIGHT = 145;

const GridLayout = WidthProvider(ReactGridLayout);

const useStyles = makeStyles((theme) => ({
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
    paddingBottom: theme.spacing(17),
  },
}));

function Dashboard() {
  const { isOpen, closeModal, openModal } = useModal();
  const { selectedDashboardMetadata, projectMetadata } = useContext(projectLayoutContext);
  const { name: dashboardName, _id: dashboardId } = selectedDashboardMetadata;

  const classes = useStyles();

  const dashboard = useSelector((state) => state.dashboards.dashboards[dashboardId]);
  const autoSaveStatus = useSelector((state) => state.dashboards.autoSaveStatus[dashboardId]);
  const dispatch = useDispatch();

  const { layout = [], charts = [], count: chartsCount = 0, notes = '' } = dashboard || {};
  const [dataSources, setDataSources] = useState(null);
  const [chartToEdit, setChartToEdit] = useState(null);
  const history = useHistory();

  async function fetchDataSources() {
    api.getDatasources(dashboardId, false, false).then((resData) => {
      const { dataSources: fetchedDataSources } = resData;
      setDataSources(fetchedDataSources);
      if (dashboardId && fetchedDataSources.length === 0) {
        history.push(`/projects/${projectMetadata.id}/configure-dataset`);
      }
    });
  }

  useEffect(() => {
    setDataSources(null);
    fetchDataSources();
  }, [dashboardId]);

  useEffect(() => {
    if (dashboardId) dispatch(fetchDashboard(dashboardId));
  }, [dashboardId]);

  function updateDashboard(newDashboard) {
    dispatch(updateDashboardAction(newDashboard));
  }

  function onApply(chartId, chartType, config, dataSourceIds) {
    const newCharts = chartId
      ? updateChart(chartId, chartType, config, dataSourceIds)
      : addChart(chartType, config, dataSourceIds);
    updateDashboard({
      charts: newCharts,
      layout,
      dashboardId,
      name: dashboardName,
      count: chartsCount + 1,
      notes,
    });
    onCloseModal();
  }

  function createDuplicateChart(chart, widgetLayout) {
    const { layout: chartLayout, ...rest } = chart;
    return {
      ...rest,
      layout: createLayout({
        id: createWidgetId(chartsCount),
        xPosition: widgetLayout.x + widgetLayout.w,
        yPosition: widgetLayout.y,
        width: widgetLayout.w,
        height: widgetLayout.h,
      }),
    };
  }

  function onDuplicate(chartId, widgetId) {
    const selectedChart = charts.find((chart) => chart.layout.i === chartId);
    const widgetLayout = layout.find((widget) => widget.i === widgetId);
    const duplicateChart = createDuplicateChart(selectedChart, widgetLayout);
    updateDashboard({
      charts: charts.concat(duplicateChart),
      layout,
      dashboardId,
      name: dashboardName,
      count: chartsCount + 1,
      notes,
    });
  }

  function onCloseModal() {
    setChartToEdit(null);
    closeModal();
  }

  function addChart(chartType, config, dataSourceIds) {
    return charts.concat({
      config,
      chartType,
      layout: getNewWidgetLayout(charts.length, COLUMNS, chartsCount),
      dataSourceIds,
    });
  }

  function updateChart(chartId, chartType, config, dataSourceIds) {
    return produce(charts, (draftCharts) => {
      const existingChart = draftCharts.find((chart) => chart.layout.i === chartId);
      existingChart.config = config;
      existingChart.dataSourceIds = dataSourceIds;
      existingChart.chartType = chartType;
    });
  }

  function updateNotes(newNotes) {
    updateDashboard({
      charts,
      layout,
      dashboardId,
      name: dashboardName,
      count: chartsCount,
      notes: newNotes,
    });
  }

  function onLayoutChange(changedLayout) {
    updateDashboard({
      charts,
      notes,
      layout: changedLayout,
      dashboardId,
      name: dashboardName,
      count: chartsCount,
    });
  }

  function onDeleteWidget(id) {
    updateDashboard({
      layout,
      dashboardId,
      notes,
      charts: charts.filter((chart) => chart.layout.i !== id),
      name: dashboardName,
      count: chartsCount,
    });
  }

  function onEditWidget(id) {
    const chart = charts.find((c) => c.layout.i === id);
    setChartToEdit(chart);
    openModal();
  }

  function retrySave() {
    updateDashboard({
      charts,
      layout,
      dashboardId,
      notes,
      name: dashboardName,
      count: chartsCount,
    });
  }

  if (!dashboard || !dataSources) {
    return null;
  }

  return (
    <>
      <Box className={classes.mainContainer}>
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
              rowHeight={ROW_HEIGHT}
              margin={[32, 32]}
              draggableHandle=".dragHandler"
            >
              {charts.map((item) =>
                renderWidget({
                  chart: item,
                  dashboardId,
                  onDelete: onDeleteWidget,
                  onEdit: onEditWidget,
                  dashboardLayout: layout,
                  onDuplicate,
                }),
              )}
            </GridLayout>
          )}
        </Box>
      </Box>
      {isOpen && (
        <ChartConfigurationWizard
          chart={chartToEdit}
          isOpen={isOpen}
          closeModal={onCloseModal}
          onApply={onApply}
        />
      )}
      <NotesModal text={notes} saveNotes={updateNotes} />
    </>
  );
}

export default Dashboard;
