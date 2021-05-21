import React from 'react';
import { useForm } from 'react-final-form';

import { Box, Divider, Typography } from '@material-ui/core';
import TextField from '../../../uiComponent/formField/TextField';
import { chartConfigOptionTypes } from '../../../constants/chartConfigOptionTypes';
import DatasourceSelector from '../dashboardConfigSelector/DatasourceSelector';
import ConfigSelector from '../dashboardConfigSelector/ConfigSelector';

function DataConfiguration() {
  const { getFieldState } = useForm();
  const showOtherConfig = getFieldState(chartConfigOptionTypes.DATASOURCE)?.value;
  return (
    <>
      <Box px={2} pb={6}>
        <Box mb={2}>
          <Typography variant="subtitle2">Chart Name</Typography>
        </Box>
        <TextField
          name={chartConfigOptionTypes.CHART_NAME}
          label="Add chart name"
          type="text"
          dataTestId="chart-name-input"
        />
      </Box>
      <Divider />
      <Box px={2} py={6}>
        <DatasourceSelector
          name={chartConfigOptionTypes.DATASOURCE}
          header="Data Source"
          id="dropdown-dataSources"
          label="select data source"
        />
      </Box>
      {showOtherConfig && (
        <>
          <Divider />
          <Box pt={6}>
            <ConfigSelector />
          </Box>
        </>
      )}
    </>
  );
}

DataConfiguration.propTypes = {};

export default DataConfiguration;
