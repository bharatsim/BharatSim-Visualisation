import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useFormContext } from 'react-hook-form';
import { Box, Typography } from '@material-ui/core';

import { api } from '../../../utils/api';
import { convertObjectArrayToOptionStructure } from '../../../utils/helper';
import { projectLayoutContext } from '../../../contexts/projectLayoutContext';
import useLoader from '../../../hook/useLoader';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import NoDataSetPresentMessage from '../../configureDataset/NoDatatSetPresentMessage';
import ControlledDropDown from '../../../uiComponent/ControlledDropdown';

function DatasourceSelector({
  name: datasourceKey,
  disabled,
  defaultValue,
  filterDatasource,
  helperText,
  noDataSourcePresentMessage,
  header,
  label,
  id,
}) {
  const { selectedDashboardMetadata, projectMetadata } = useContext(projectLayoutContext);

  const { control, setValue, errors, registerDatasource, watch } = useFormContext();
  const datasourceValue = watch(datasourceKey);
  const error = errors[datasourceKey] || {};

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
  useEffect(() => {
    registerDatasource(datasourceKey, datasourceValue);
  }, [datasourceValue]);

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
            name={datasourceKey}
            control={control}
            validations={{ required: 'Required' }}
            defaultValue={defaultValue}
            error={error}
            helperText={helperText}
            setValue={setValue}
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
  defaultValue: '',
  filterDatasource: null,
  noDataSourcePresentMessage: '',
  helperText: '',
  disabled: false,
};

DatasourceSelector.propTypes = {
  name: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.string,
  helperText: PropTypes.string,
  filterDatasource: PropTypes.func,
  noDataSourcePresentMessage: PropTypes.string,
};

export default DatasourceSelector;
