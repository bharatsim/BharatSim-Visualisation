import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import { useForm } from 'react-final-form';

import chartConfigs from '../../../config/chartConfigs';
import { api } from '../../../utils/api';
import chartConfigOptions from '../../../config/chartConfigOptions';
import useLoader from '../../../hook/useLoader';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import { chartConfigOptionTypes } from '../../../constants/chartConfigOptionTypes';
import { useFormContext } from '../../../contexts/FormContext';

function ConfigSelector() {
  const [fetchedCsvHeaders, setFetchedCsvHeaders] = useState();
  const { chartType, isEditMode } = useFormContext();
  const { getFieldState, change } = useForm();

  const dataSourceId = getFieldState(chartConfigOptionTypes.DATASOURCE)?.value;

  const {
    startLoader,
    stopLoaderAfterSuccess,
    stopLoaderAfterError,
    loadingState,
    message,
  } = useLoader();

  useEffect(() => {
    if (!isEditMode) configOptionsKeysForSelectedChart.forEach((key) => change(key));
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
  const chartConfigProps = { headers };
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

export default ConfigSelector;
