import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import useFetch from '../../../hook/useFetch';
import chartConfigs from '../../../config/chartConfigs';
import { api } from '../../../utils/api';
import chartConfigOptions from '../../../config/chartConfigOptions';

function ConfigSelector({ dataSourceId, chartType, updateConfigState, errors, values }) {
  const { data: csvHeaders } = useFetch(api.getCsvHeaders, [dataSourceId]);

  const { headers } = csvHeaders || {};
  const chartConfigProps = { headers, updateConfigState, errors, values };
  const configOptionsKeysForSelectedChart = chartConfigs[chartType].configOptions;
  function isLastConfigOption(configs, index) {
    return configs.length - index === 1;
  }
  return (
    <div>
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
    </div>
  );
}

ConfigSelector.propTypes = {
  dataSourceId: PropTypes.string.isRequired,
  chartType: PropTypes.string.isRequired,
  updateConfigState: PropTypes.func.isRequired,
  errors: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired,
};

export default ConfigSelector;
