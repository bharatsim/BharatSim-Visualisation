import React, { useEffect } from 'react';
import { useForm } from 'react-final-form';

import { Box, Divider } from '@material-ui/core';
import { chartConfigOptionTypes } from '../../../constants/chartConfigOptionTypes';
import { useFormContext } from '../../../contexts/FormContext';
import chartConfigOptions from '../../../config/chartConfigOptions';
import chartConfigs from '../../../config/chartConfigs';

function isLastConfigOption(configs, index) {
  return configs.length - index === 1;
}

function StyleConfig() {
  const { getFieldState, change } = useForm();
  const { isEditMode, chartType } = useFormContext();
  const dataSourceId = getFieldState(chartConfigOptionTypes.DATASOURCE)?.value;
  const configOptionsKeysForSelectedChart = chartConfigs[chartType].styleConfig || [];

  useEffect(() => {
    if (!isEditMode) configOptionsKeysForSelectedChart.forEach((key) => change(key));
  }, [dataSourceId]);

  return (
    <>
      <div>
        {configOptionsKeysForSelectedChart.map((chartConfigKey, index) => (
          <Box key={chartConfigKey} pb={4}>
            <Box pb={4}>{chartConfigOptions[chartConfigKey].component()}</Box>
            {isLastConfigOption(configOptionsKeysForSelectedChart, index) ? '' : <Divider />}
          </Box>
        ))}
      </div>
    </>
  );
}

export default StyleConfig;
