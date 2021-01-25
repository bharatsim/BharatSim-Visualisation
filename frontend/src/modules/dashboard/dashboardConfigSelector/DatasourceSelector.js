import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Typography } from '@material-ui/core';
import { api } from '../../../utils/api';
import { convertObjectArrayToOptionStructure } from '../../../utils/helper';
import Dropdown from '../../../uiComponent/Dropdown';
import { projectLayoutContext } from '../../../contexts/projectLayoutContext';
import useLoader from '../../../hook/useLoader';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import NoDataSetPresentMessage from '../../configureDataset/NoDatatSetPresentMessage';

function DatasourceSelector({ handleDataSourceChange, value, error, disabled  }) {
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

  const dataSources = fetchedDatasources ? fetchedDatasources.dataSources : [];

  const isDataSourcePresent = dataSources.length > 0;

  const onErrorAction = {
    name: 'Retry',
    onClick: fetchDatasources,
  };

  return (
    <LoaderOrError
      loadingState={loadingState}
      message={message}
      errorAction={onErrorAction}
      fullWidth
    >
      {isDataSourcePresent ? (
        <>
          <Box mb={2}>
            <Typography variant="subtitle2"> Data Source </Typography>
          </Box>
          <Dropdown
            options={convertObjectArrayToOptionStructure(dataSources, 'name', '_id')}
            onChange={handleDataSourceChange}
            id="dropdown-dataSources"
            label="select data source"
            error={error}
            value={value}
            disabled={disabled}
          />
        </>
      ) : (
        <Box>
          <NoDataSetPresentMessage projectMetadataId={projectMetadata.id} />
        </Box>
      )}
    </LoaderOrError>
  );
}

DatasourceSelector.defaultProps = {
  error: '',
  value: '',
  disabled: false,
};

DatasourceSelector.propTypes = {
  handleDataSourceChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
};

export default DatasourceSelector;
