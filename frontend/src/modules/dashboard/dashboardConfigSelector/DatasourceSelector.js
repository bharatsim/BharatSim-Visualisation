import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Typography } from '@material-ui/core';
import { api } from '../../../utils/api';
import { convertObjectArrayToOptionStructure } from '../../../utils/helper';
import { projectLayoutContext } from '../../../contexts/projectLayoutContext';
import useLoader from '../../../hook/useLoader';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import NoDataSetPresentMessage from '../../configureDataset/NoDatatSetPresentMessage';
import ControlledDropDown from '../../../uiComponent/ControlledDropdown';

function DatasourceSelector({
  name,
  control,
  disabled,
  defaultValue,
  filterDatasource,
  error,
  helperText,
  noDataSourcePresentMessage,
  header,
  label,
  id,
}) {
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
      .then(({ dataSources }) => {
        stopLoaderAfterSuccess();
        if (filterDatasource) {
          const filteredDatasources = dataSources.filter(filterDatasource);
          setFetchedDatasources(filteredDatasources);
        }
        setFetchedDatasources(dataSources);
      })
      .catch(() => {
        stopLoaderAfterError('Unable to fetch data sources');
      });
  }

  const dataSources = fetchedDatasources || [];

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
            <Typography variant="subtitle2">{header}</Typography>
          </Box>
          <ControlledDropDown
            options={convertObjectArrayToOptionStructure(dataSources, 'name', '_id')}
            id={id}
            label={label}
            disabled={disabled}
            name={name}
            control={control}
            validations={{ required: 'Required' }}
            defaultValue={defaultValue}
            error={error}
            helperText={helperText}
          />
        </>
      ) : (
        <Box>
          <NoDataSetPresentMessage
            projectMetadataId={projectMetadata.id}
            message={noDataSourcePresentMessage}
          />
        </Box>
      )}
    </LoaderOrError>
  );
}

DatasourceSelector.defaultProps = {
  disabled: false,
  defaultValue: '',
  filterDatasource: null,
  noDataSourcePresentMessage: '',
  error: {},
  helperText: '',
};

DatasourceSelector.propTypes = {
  name: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  control: PropTypes.shape({}).isRequired,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.string,
  helperText: PropTypes.string,
  filterDatasource: PropTypes.func,
  noDataSourcePresentMessage: PropTypes.string,
  error: PropTypes.shape({}),
};

export default DatasourceSelector;
