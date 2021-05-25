import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import { useForm } from 'react-final-form';

import { useSnackbar } from 'notistack';
import chartConfigs from '../../../config/chartConfigs';
import { api } from '../../../utils/api';
import chartConfigOptions from '../../../config/chartConfigOptions';
import useLoader from '../../../hook/useLoader';
import LoaderOrError from '../../loaderOrError/LoaderOrError';
import { chartConfigOptionTypes } from '../../../constants/chartConfigOptionTypes';
import { useFormContext } from '../../../contexts/FormContext';
import { compareArrayByValues } from '../../../utils/helper';
import snackbarVariant from '../../../constants/snackbarVariant';

function isMatchingHeaders(newHeaders, prevHeaders) {
  const newColumns = newHeaders.headers.map(({ name }) => name);
  const prevColumns = prevHeaders.headers.map(({ name }) => name);
  return compareArrayByValues(newColumns, prevColumns);
}

function ConfigSelector() {
  const [fetchedCsvHeaders, setFetchedCsvHeaders] = useState();
  const { chartType } = useFormContext();
  const { getFieldState, reset } = useForm();
  const { enqueueSnackbar } = useSnackbar();

  const dataSourceId = getFieldState(chartConfigOptionTypes.DATASOURCE)?.value;

  const {
    startLoader,
    stopLoaderAfterSuccess,
    stopLoaderAfterError,
    loadingState,
    message,
  } = useLoader();

  useEffect(() => {
    if (dataSourceId) fetchCsvHeaders();
  }, [dataSourceId]);

  function resetConfig() {
    const chartName = getFieldState(chartConfigOptionTypes.CHART_NAME)?.value;
    reset({
      [chartConfigOptionTypes.DATASOURCE]: dataSourceId,
      [chartConfigOptionTypes.CHART_NAME]: chartName,
    });
  }

  function onFetchCsvHeaderSuccess(resData) {
    const shouldResetConfig = fetchedCsvHeaders && !isMatchingHeaders(resData, fetchedCsvHeaders);
    if (shouldResetConfig) {
      resetConfig();
      enqueueSnackbar('Configuration wizard form got reset for new data-source selection', {
        variant: snackbarVariant.INFO,
      });
    }
    stopLoaderAfterSuccess();
    setFetchedCsvHeaders(resData);
  }

  async function fetchCsvHeaders() {
    startLoader();
    api
      .getCsvHeaders(dataSourceId)
      .then(onFetchCsvHeaderSuccess)
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
