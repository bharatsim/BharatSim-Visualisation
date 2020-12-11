import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import chartConfigs from '../../../config/chartConfigs';
import { api } from '../../../utils/api';
import chartConfigOptions from '../../../config/chartConfigOptions';
import useLoader from '../../../hook/useLoader';
import LoaderOrError from '../../loaderOrError/LoaderOrError';

function ConfigSelector({
  dataSourceId,
  chartType,
  updateConfigState,
  errors,
  values,
  resetValue,
}) {
  const [fetchedCsvHeaders, setFetchedCsvHeaders] = useState();

  const {
    startLoader,
    stopLoaderAfterSuccess,
    stopLoaderAfterError,
    loadingState,
    message,
  } = useLoader();

  useEffect(() => {
    configOptionsKeysForSelectedChart.map((chartConfigKey) => resetValue(chartConfigKey));
    fetchCsvHeaders();
  }, [dataSourceId]);

  async function fetchCsvHeaders() {
    startLoader();
    api
      .getCsvHeaders(dataSourceId)
      .then((resData) => {
        stopLoaderAfterSuccess();
        setFetchedCsvHeaders(resData);
      })
      .catch(() => {
        stopLoaderAfterError('Unable to fetch data source headers');
      });
  }

  const { headers } = fetchedCsvHeaders || {};
  const chartConfigProps = { headers, updateConfigState, errors, values };
  const configOptionsKeysForSelectedChart = chartConfigs[chartType].configOptions;
  function isLastConfigOption(configs, index) {
    return configs.length - index === 1;
  }

  const onErrorAction = {
    name: 'Retry',
    onClick: fetchCsvHeaders,
  };

  return (
    <LoaderOrError
      loadingState={loadingState}
      message={message}
      errorAction={onErrorAction}
      fullWidth
    >
      <>
        {headers && (
          <div>
            {configOptionsKeysForSelectedChart.map((chartConfigKey, index) => (
              <Box key={chartConfigKey} pb={4}>
                <Box pb={4}>{chartConfigOptions[chartConfigKey].component(chartConfigProps)}</Box>
                {isLastConfigOption(configOptionsKeysForSelectedChart, index) ? '' : <Divider />}
              </Box>
            ))}
          </div>
        )}
      </>
    </LoaderOrError>
  );
}

ConfigSelector.propTypes = {
  dataSourceId: PropTypes.string.isRequired,
  chartType: PropTypes.string.isRequired,
  updateConfigState: PropTypes.func.isRequired,
  resetValue: PropTypes.func.isRequired,
  errors: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired,
};

export default ConfigSelector;
