import React, { useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { projectLayoutContext } from '../../contexts/projectLayoutContext';
import useManageDatasetStyles from './manageDatasetCSS';
import ProjectHeader from '../../uiComponent/ProjectHeader';
import { api } from '../../utils/api';
import DashboardDataSetsTable from './DashboardDataSetsTable';
import plusIcon from '../../assets/images/plus.svg';
import DashboardHeaderBar from '../../uiComponent/DashboardHeaderBar';
import NoDataSetPresentMessage from './NoDatatSetPresentMessage';
import GlobalDatasetTable from './GlobalDatasetTable';
import { uniqueObjectsBy } from '../../utils/helper';
import snackbarVariant from '../../constants/snackbarVariant';

const UNIQUE_ID_FOR_DATASOURCES = '_id';

function getUniqueGlobalDatasources(datasources, globalDataSources) {
  return uniqueObjectsBy([...datasources, ...globalDataSources], UNIQUE_ID_FOR_DATASOURCES);
}

function ManageDataset() {
  const classes = useManageDatasetStyles();
  const history = useHistory();
  const [dataSources, setDataSources] = useState(null);
  const [globalDataSources, setGlobalDataSources] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const { SUCCESS } = snackbarVariant;

  const {
    projectMetadata,
    selectedDashboardMetadata: { _id: selectedDashboardId, name: selectedDashboardName },
  } = useContext(projectLayoutContext);

  async function fetchDataSources() {
    const { dataSources: fetchedDataSources } = await api.getDatasources(
      selectedDashboardId,
      false,
      false,
    );

    setDataSources(fetchedDataSources);
  }

  async function fetchDatasets() {
    const { dataSources: fetchedDataSources } = await api.getAllDatasources();
    setGlobalDataSources(fetchedDataSources);
  }

  useEffect(() => {
    fetchDataSources();
    fetchDatasets();
  }, []);

  const uploadFilePage = `/projects/${projectMetadata.id}/upload-dataset`;

  function openUploadDatasets() {
    history.push(uploadFilePage);
  }

  function openDashboard() {
    history.push(`/projects/${projectMetadata.id}/dashboard`);
  }

  const isEmptyDashboards = dataSources && dataSources.length === 0;

  function uncheckedAllDatasources() {
    const updatedGlobalDatasources = globalDataSources.map(({ tableData, ...rest }) => rest);
    setGlobalDataSources(updatedGlobalDatasources);
  }

  async function mapSelectedDatasourcesToDashboard(checkedDatasources) {
    const datasourceDashboardMap = checkedDatasources.map(({ _id: datasourceId }) => ({
      dashboardId: selectedDashboardId,
      datasourceId,
    }));
    return api.addDatasourceDashboardMaps(datasourceDashboardMap);
  }

  async function addDatasource(checkedDatasources) {
    const updatedDataSources = uniqueObjectsBy(
      [...dataSources, ...checkedDatasources],
      UNIQUE_ID_FOR_DATASOURCES,
    ).map(({ tableData, ...rest }) => ({ ...rest, widgetUsage: rest.widgetUsage || 0 }));

    mapSelectedDatasourcesToDashboard(checkedDatasources).then(() => {
      setDataSources(updatedDataSources);
      uncheckedAllDatasources();
      enqueueSnackbar('Successfully added selected datasources', { variant: SUCCESS });
    });
  }

  function removeDatasource(checkedDatasource) {
    const { _id: checkedDatasourceId, name } = checkedDatasource;
    const updatedDataSources = dataSources
      .filter(({ _id: datasourceId }) => checkedDatasourceId !== datasourceId)
      .map(({ tableData, ...rest }) => rest);
    api
      .removeDatasourceDashboardMaps({
        dashboardId: selectedDashboardId,
        datasourceId: checkedDatasourceId,
      })
      .then(() => {
        enqueueSnackbar(`Successfully removed  ${name} datasource from dashboard`, {
          variant: SUCCESS,
        });
        setDataSources(updatedDataSources);
      });
  }

  function addColumn(checkedDatasource, columnName, expression) {
    const { _id: checkedDatasourceId, name } = checkedDatasource;
    api.addColumn(checkedDatasourceId, expression, columnName).then(() => {
      enqueueSnackbar(`Successfully update ${name} datasource with new Column ${columnName}`, {
        variant: SUCCESS,
      });
    });
  }
  function deleteDatasource(checkedDatasource) {
    const { _id: checkedDatasourceId, name } = checkedDatasource;
    const updatedDataSources = dataSources
      .filter(({ _id: datasourceId }) => checkedDatasourceId !== datasourceId)
      .map(({ tableData, ...rest }) => rest);
    const updatedGlobalDataSources = globalDataSources
      .filter(({ _id: datasourceId }) => checkedDatasourceId !== datasourceId)
      .map(({ tableData, ...rest }) => rest);
    api.deleteDatasource(checkedDatasourceId).then(() => {
      enqueueSnackbar(`Successfully deleted ${name} datasource`, { variant: SUCCESS });
      setDataSources(updatedDataSources);
      setGlobalDataSources(updatedGlobalDataSources);
    });
  }

  return (
    <Box>
      <ProjectHeader />
      <DashboardHeaderBar>
        <Box className={classes.configureProjectDataBar}>
          <Typography variant="h6"> Configure Dashboard Data</Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={openDashboard}
            disabled={isEmptyDashboards}
          >
            Go to dashboard
          </Button>
        </Box>
      </DashboardHeaderBar>
      <Box className={classes.dashboardDataContainer}>
        {dataSources && (
          <>
            <Box className={classes.dashboardDataContainerTitle}>
              <Typography variant="subtitle2"> Manage Dashboard Dataset</Typography>
              <Button
                color="secondary"
                variant="contained"
                size="small"
                startIcon={<img src={plusIcon} alt="icon" />}
                onClick={openUploadDatasets}
              >
                Upload Data
              </Button>
            </Box>
            <Box className={classes.dashboardDataHeader}>
              <Typography variant="subtitle2">{`${projectMetadata.name} :: ${selectedDashboardName}`}</Typography>
            </Box>
            <Box className={classes.dashboardDataBody}>
              {dataSources.length === 0 ? (
                <NoDataSetPresentMessage projectMetadataId={projectMetadata.id} />
              ) : (
                <DashboardDataSetsTable
                  dataSources={dataSources}
                  onRemove={removeDatasource}
                  onDelete={deleteDatasource}
                  onAddColumn={addColumn}
                />
              )}
            </Box>
          </>
        )}
        {globalDataSources && dataSources && globalDataSources.length > 0 && (
          <Box mt={10}>
            <Typography variant="subtitle2">Add from dataset Library</Typography>
            <Box mt={2}>
              <GlobalDatasetTable
                dataSources={getUniqueGlobalDatasources(dataSources, globalDataSources)}
                onAddDatasourceClick={addDatasource}
                selectedDatasources={dataSources}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ManageDataset;
