import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Button, FormHelperText, Typography, withStyles } from '@material-ui/core';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styles from './dashboardLayoutCss';

import { getNewWidgetLayout, renderElement } from '../../utils/dashboardLayoutUtils';
import labels from '../../constants/labels';
import ChartConfigModal from '../chartConfigModal/ChartConfigModal';
import useModal from '../../hook/useModal';
import { chartTypes } from '../../constants/charts';
import FileUpload from '../fileUpload/FileUpload';
import ButtonGroup from '../../uiComponent/ButtonGroup';
import { fetchData, headerBuilder, uploadData } from '../../utils/fetch';
import { url } from '../../utils/url';
import { contentTypes } from '../../constants/fetch';

const GridLayout = WidthProvider(ReactGridLayout);
const cols = 12;

function DashboardLayout({ classes }) {
  const [dashboardConfig, setDashboardConfig] = useState({
    name: 'dashboard1',
    id: null,
    count: 0,
  });
  const [widgets, setWidgets] = useState([]);
  const [dashboardError, setDashboardError] = useState(null);
  const [layout, setLayout] = useState([]);
  const [chartType, setChartType] = useState();
  const { isOpen, closeModal, openModal } = useModal();

  useEffect(() => {
    async function fetchApiData() {
      const resData = await fetchData({ url: url.DASHBOARD_URL });
      if (resData.dashboards.length > 0) {
        const {
          count,
          name,
          _id,
          widgets: savedWidgets,
          layout: savedLayout,
        } = resData.dashboards[0];
        setWidgets(savedWidgets);
        setLayout(savedLayout);
        setDashboardConfig({ name, id: _id, count });
      }
    }

    fetchApiData();
  }, []);

  function addItem(config) {
    setWidgets((prevWidgets) => {
      return prevWidgets.concat({
        config,
        chartType,
        layout: getNewWidgetLayout(prevWidgets.length, cols, dashboardConfig.count),
      });
    });
    setDashboardConfig((prevState) => ({ ...prevState, count: prevState.count + 1 }));
  }

  function handleModalOk(config) {
    addItem(config);
    closeModal();
  }

  function onLayoutChange(changedLayout) {
    setLayout(changedLayout);
  }

  function oneChartClick(selectedChartType) {
    openModal();
    setChartType(selectedChartType);
  }
  function saveDashboard() {
    uploadData({
      url: url.DASHBOARD_URL,
      headers: headerBuilder({ contentType: contentTypes.JSON }),
      data: JSON.stringify({
        dashboardData: {
          widgets,
          layout,
          dashboardId: dashboardConfig.id,
          name: dashboardConfig.name,
          count: dashboardConfig.count,
        },
      }),
    })
      .then((data) => {
        setDashboardConfig((prevState) => ({ ...prevState, id: data.dashboardId }));
      })
      .catch(() => {
        setDashboardError('Failed to save dashboard');
      });
  }

  return (
    <Box pl={10} pt={10} pr={10}>
      <Box pb={2}>
        <FileUpload />
      </Box>
      <Box pb={2} display="flex" justifyContent="space-between">
        <ButtonGroup>
          <Button
            onClick={() => oneChartClick(chartTypes.BAR_CHART)}
            variant="contained"
            color="primary"
          >
            {labels.dashboardLayout.Bar_CHART}
          </Button>
          <Button
            onClick={() => oneChartClick(chartTypes.LINE_CHART)}
            variant="contained"
            color="primary"
          >
            {labels.dashboardLayout.LINE_CHART}
          </Button>
        </ButtonGroup>
        <Box>
          <Button onClick={saveDashboard} variant="contained" color="primary">
            {labels.dashboardLayout.SAVE_DASHBOARD_BUTTON}
          </Button>
          {!!dashboardError && <FormHelperText error> {dashboardError} </FormHelperText>}
        </Box>
      </Box>
      <GridLayout
        layout={layout}
        onLayoutChange={onLayoutChange}
        className={classes.reactGridLayout}
      >
        {widgets.map((item) => {
          return renderElement(item);
        })}
      </GridLayout>
      {isOpen && (
        <ChartConfigModal
          onCancel={closeModal}
          onOk={handleModalOk}
          open={isOpen}
          chartType={chartType}
        />
      )}
    </Box>
  );
}

DashboardLayout.propTypes = {
  classes: PropTypes.shape({
    reactGridLayout: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(styles)(DashboardLayout);
