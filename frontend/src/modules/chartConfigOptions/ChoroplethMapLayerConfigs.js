import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from 'react-final-form';

import DatasourceSelector from '../dashboard/dashboardConfigSelector/DatasourceSelector';
import { shapeFileFilter } from '../../utils/helper';
import HeadersSelector from './HeaderSelector';
import LoaderOrError from '../loaderOrError/LoaderOrError';
import { api } from '../../utils/api';
import useLoader, { loaderStates } from '../../hook/useLoader';
import { useFormContext } from '../../contexts/FormContext';
import { required } from '../../utils/validators';

const useStyles = makeStyles((theme) => ({
  caption: {
    color: theme.palette.text.secondary,
  },
}));

const choroplethConfigTypes = {
  MAP_LAYER: 'mapLayer',
  MAP_LAYER_ID: 'mapLayerId',
  DATA_LAYER_ID: 'dataLayerId',
  REFERENCE_ID: 'referenceId',
};

function ChoroplethMapLayerConfig({ headers, configKey, shouldShowReferenceIdConfig, levelIndex }) {
  const classes = useStyles();
  const { isEditMode } = useFormContext();
  const { getFieldState } = useForm();
  const dataSourceId = getFieldState(`${configKey}.${choroplethConfigTypes.MAP_LAYER}`)?.value;

  const {
    stopLoaderAfterSuccess,
    stopLoaderAfterError,
    startLoader,
    loadingState,
    message,
  } = useLoader(loaderStates.SUCCESS);
  const [geoJsonProperties, setGeoJsonProperties] = useState();

  async function fetchCsvHeaders() {
    startLoader();
    api
      .getCsvHeaders(dataSourceId)
      .then(({ headers: fetchedHeaders }) => {
        stopLoaderAfterSuccess();
        setGeoJsonProperties(fetchedHeaders);
      })
      .catch(() => {
        stopLoaderAfterError('Unable to fetch data source headers might be due to wrong file type');
      });
  }

  useEffect(() => {
    if (dataSourceId) fetchCsvHeaders();
  }, [dataSourceId]);

  return (
    <Box>
      <Box pl={2} pb={4} pt={1}>
        <DatasourceSelector
          disable={isEditMode}
          name={`${configKey}.${choroplethConfigTypes.MAP_LAYER}`}
          datasourceFilter={shapeFileFilter}
          noDataSourcePresentMessage="Before we can create any GIS visualization, we‘ll need some GIS layer data."
          header="Map Layer"
          id="gisMapLayer-dropdown"
          label="select map layer"
          helperText="file format: GeoJson, topojson"
          validate={required}
        />
      </Box>
      <LoaderOrError message={message} loadingState={loadingState} fullWidth>
        <Box>
          <Box pl={2} pb={4}>
            <Typography variant="subtitle2">Geo ID Mapping</Typography>
            <Typography variant="caption" classes={{ caption: classes.caption }}>
              Select common column by which you want to join the map file with dataset
            </Typography>
          </Box>
          <Box display="flex">
            <HeadersSelector
              label="select map layer id"
              headers={geoJsonProperties || []}
              id="mapLayerId"
              title="Map Layer ID"
              configKey={`${configKey}.${choroplethConfigTypes.MAP_LAYER_ID}`}
              border={false}
              disabled={!dataSourceId}
              validate={required}
            />
            <Box pt={13}>=</Box>
            <HeadersSelector
              label="select data layer id"
              headers={headers}
              id="dataLayerId"
              title="Data Layer ID"
              configKey={`${configKey}.${choroplethConfigTypes.DATA_LAYER_ID}`}
              border={false}
              disabled={!dataSourceId}
              validate={required}
            />
          </Box>
          {shouldShowReferenceIdConfig && (
            <Box pt={2}>
              <HeadersSelector
                label="select reference id"
                headers={geoJsonProperties || []}
                id="reference id"
                title={`Reference ID for Level ${levelIndex}`}
                configKey={`${configKey}.${choroplethConfigTypes.REFERENCE_ID}`}
                border={false}
                disabled={!dataSourceId}
                helperText="Select the field to link the current drill down level with the preceding level."
                validate={required}
              />
            </Box>
          )}
        </Box>
      </LoaderOrError>
    </Box>
  );
}

ChoroplethMapLayerConfig.defaultProps = {
  shouldShowReferenceIdConfig: false,
  levelIndex: undefined,
};

ChoroplethMapLayerConfig.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configKey: PropTypes.string.isRequired,
  shouldShowReferenceIdConfig: PropTypes.bool,
  levelIndex: PropTypes.number,
};

export default ChoroplethMapLayerConfig;
