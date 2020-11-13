import React, { useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { projectLayoutContext } from '../../contexts/projectLayoutContext';
import useConfigureDatasetStyles from './configureDatasetCSS';
import ProjectHeader from '../../uiComponent/ProjectHeader';
import useFetch from '../../hook/useFetch';
import { api } from '../../utils/api';
import DashboardDataSetsTable from './DashboardDataSetsTable';
import plusIcon from '../../assets/images/plus.svg';
import DashboardHeaderBar from '../../uiComponent/DashboardHeaderBar';

function ConfigureDataset() {
  const classes = useConfigureDatasetStyles();
  const history = useHistory();
  const [dataSources, setDataSources] = useState(null);

  const {
    projectMetadata,
    selectedDashboardMetadata: { _id: selectedDashboardId, name: selectedDashboardName },
  } = useContext(projectLayoutContext);

  const { data: fetchedDataSources } = useFetch(
    api.getDatasources,
    [selectedDashboardId],
    !!selectedDashboardId,
  );

  const uploadFilePage = `/projects/${projectMetadata.id}/upload-dataset`;

  useEffect(() => {
    if (fetchedDataSources) {
      setDataSources(fetchedDataSources.dataSources);
    }
  }, [fetchedDataSources]);

  function openUploadDatasets() {
    history.push(uploadFilePage);
  }
  if (!dataSources) {
    return null;
  }
  function openDashboard() {
    history.push(`/projects/${projectMetadata.id}/dashboard`);
  }

  return (
    <Box>
      <ProjectHeader />
      <DashboardHeaderBar>
        <Box className={classes.configureProjectDataBar}>
          <Typography variant="h6"> Configure Dashboard Data</Typography>
          <Button variant="contained" color="primary" size="small" onClick={openDashboard}>
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
          {dataSources && dataSources.length > 0 ? (
            <DashboardDataSetsTable dataSources={dataSources} />
          ) : (
            <Box className={classes.noDataSourcesMessage}>
              <Typography variant="subtitle2" color="textPrimary">
                Before we can create any visualization, we ‘ll need some data.
              </Typography>
              <Typography variant="body2">
                Use
                {' '}
                <Link to={uploadFilePage} component={RouterLink}>
                  {' '}
                  Upload dataset
                  {' '}
                </Link>
                to add data files to your dashboard.
              </Typography>
              {' '}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ConfigureDataset;
