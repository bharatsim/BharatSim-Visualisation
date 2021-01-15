import React, { useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { projectLayoutContext } from '../../contexts/projectLayoutContext';
import useConfigureDatasetStyles from './configureDatasetCSS';
import ProjectHeader from '../../uiComponent/ProjectHeader';
import { api } from '../../utils/api';
import DashboardDataSetsTable from './DashboardDataSetsTable';
import plusIcon from '../../assets/images/plus.svg';
import DashboardHeaderBar from '../../uiComponent/DashboardHeaderBar';
import NoDataSetPresentMessage from './NoDatatSetPresentMessage';

function ConfigureDataset() {
  const classes = useConfigureDatasetStyles();
  const history = useHistory();
  const [dataSources, setDataSources] = useState(null);

  const {
    projectMetadata,
    selectedDashboardMetadata: { _id: selectedDashboardId, name: selectedDashboardName },
  } = useContext(projectLayoutContext);

  async function fetchDataSources() {
    api.getDatasources(selectedDashboardId, false, false).then((resData) => {
      const { dataSources: fetchedDataSources } = resData;
      setDataSources(fetchedDataSources);
    });
  }

  useEffect(() => {
    fetchDataSources();
  }, []);

  const uploadFilePage = `/projects/${projectMetadata.id}/upload-dataset`;

  function openUploadDatasets() {
    history.push(uploadFilePage);
  }

  if (!dataSources) {
    return null;
  }

  function openDashboard() {
    history.push(`/projects/${projectMetadata.id}/dashboard`);
  }

  const isEmptyDashboards = dataSources && dataSources.length === 0;

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
          {isEmptyDashboards ? (
            <NoDataSetPresentMessage projectMetadataId={projectMetadata.id} />
          ) : (
            <DashboardDataSetsTable dataSources={dataSources} />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ConfigureDataset;
