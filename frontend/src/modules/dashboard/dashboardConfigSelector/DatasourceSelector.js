import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Typography } from '@material-ui/core';
import { useForm } from 'react-final-form';

import { api } from '../../../utils/api';
import { convertObjectArrayToOptionStructure } from '../../../utils/helper';
import { projectLayoutContext } from '../../../contexts/projectLayoutContext';
import useLoader from '../../../hook/useLoader';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import NoDataSetPresentMessage from '../../manageDataset/NoDatatSetPresentMessage';
import DropDownField from '../../../uiComponent/formField/SelectField';
import { useFormContext } from '../../../contexts/FormContext';

function DatasourceSelector({
  name: datasourceKey,
  disabled,
  datasourceFilter,
  helperText,
  noDataSourcePresentMessage,
  header,
  label,
  id,
  validate,
}) {
  const { selectedDashboardMetadata, projectMetadata } = useContext(projectLayoutContext);

  const { registerDatasource } = useFormContext();
  const { getFieldState } = useForm();
  const datasourceValue = getFieldState(datasourceKey)?.value;

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

        if (datasourceFilter) {
          const filteredDatasources = dataSources.filter(datasourceFilter);
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
          <DropDownField
            id={id}
            options={convertObjectArrayToOptionStructure(dataSources, 'name', '_id')}
            label={label}
            disabled={disabled}
            name={datasourceKey}
            helperText={helperText}
            validate={validate}
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
  datasourceFilter: null,
  noDataSourcePresentMessage: '',
  helperText: '',
  disabled: false,
  validate: null,
};

DatasourceSelector.propTypes = {
  name: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  datasourceFilter: PropTypes.func,
  noDataSourcePresentMessage: PropTypes.string,
  validate: PropTypes.func,
};

export default DatasourceSelector;
