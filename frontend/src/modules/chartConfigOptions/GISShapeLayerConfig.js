import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Typography } from '@material-ui/core';
import { projectLayoutContext } from '../../contexts/projectLayoutContext';
import useLoader from '../../hook/useLoader';
import { api } from '../../utils/api';
import { convertObjectArrayToOptionStructure } from '../../utils/helper';
import Dropdown from '../../uiComponent/Dropdown';
import LoaderOrError from '../loaderOrError/LoaderOrError';
import NoDataSetPresentMessage from '../configureDataset/NoDatatSetPresentMessage';

const GISShapeLayerFileTypes = ['geojson', 'topojson', 'json'];

function GISShapeLayerConfig({ handleConfigChange, configKey, error, value }) {
  const { selectedDashboardMetadata, projectMetadata } = useContext(projectLayoutContext);
  const { _id: selectedDashboardId } = selectedDashboardMetadata;
  const {
    startLoader,
    stopLoaderAfterSuccess,
    stopLoaderAfterError,
    loadingState,
    message,
  } = useLoader();
  const [fetchedDatasources, setFetchedDatasources] = useState();

  useEffect(() => {
    fetchDatasources();
  }, []);

  async function fetchDatasources() {
    startLoader();
    api
      .getDatasources(selectedDashboardId)
      .then((resData) => {
        stopLoaderAfterSuccess();
        setFetchedDatasources(resData);
      })
      .catch(() => {
        stopLoaderAfterError('Unable to fetch data sources');
      });
  }

  const dataSources = fetchedDatasources
    ? fetchedDatasources.dataSources.filter((dataSource) =>
        GISShapeLayerFileTypes.includes(dataSource.fileType),
      )
    : [];

  const isDataSourcePresent = dataSources.length > 0;

  const onErrorAction = {
    name: 'Retry',
    onClick: fetchDatasources,
  };

  function handleChange(selectedValue) {
    handleConfigChange(configKey, selectedValue);
  }

  return (
    <LoaderOrError
      loadingState={loadingState}
      message={message}
      errorAction={onErrorAction}
      fullWidth
    >
      <Box px={2}>
        {isDataSourcePresent ? (
          <>
            <Box mb={2}>
              <Typography variant="subtitle2">GIS Shape Layer</Typography>
            </Box>
            <Dropdown
              options={convertObjectArrayToOptionStructure(dataSources, 'name', '_id')}
              onChange={handleChange}
              id="dropdown-gis-shape-layer"
              label="select GIS shape Layer"
              error={error}
              value={value}
            />
          </>
        ) : (
          <Box>
            <NoDataSetPresentMessage
              projectMetadataId={projectMetadata.id}
              message="Before we can create any GIS visualization, we‘ll need some GIS layer data."
            />
          </Box>
        )}
      </Box>
    </LoaderOrError>
  );
}

GISShapeLayerConfig.defaultProps = {
  error: '',
  value: '',
};

GISShapeLayerConfig.propTypes = {
  handleConfigChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  value: PropTypes.string,
  configKey: PropTypes.string.isRequired,
};

export default GISShapeLayerConfig;
