import React from 'react';
import { useForm } from 'react-final-form';

import { Box, Divider } from '@material-ui/core';
import TextField from '../../../uiComponent/formField/TextField';
import { chartConfigOptionTypes } from '../../../constants/chartConfigOptionTypes';
import DatasourceSelector from '../dashboardConfigSelector/DatasourceSelector';
import ConfigSelector from '../dashboardConfigSelector/ConfigSelector';
import FieldContainer from '../../../uiComponent/formField/FieldContainer';
import { required } from '../../../utils/validators';
import { datasourceFileFilter } from '../../../utils/helper';

function DataConfiguration() {
  const { getFieldState } = useForm();
  const showOtherConfig = getFieldState(chartConfigOptionTypes.DATASOURCE)?.value;
  return (
    <>
      <Box pb={4}>
        <FieldContainer title="Chart Name">
          <TextField
            name={chartConfigOptionTypes.CHART_NAME}
            label="Enter chart name"
            type="text"
            dataTestId="chart-name-input"
          />
        </FieldContainer>
      </Box>
      <Divider />
      <Box py={4}>
        <DatasourceSelector
          name={chartConfigOptionTypes.DATASOURCE}
          header="Data Source"
          id="dropdown-dataSources"
          label="Select data source"
          helperText="Data source change may or may not reset the chart configuration"
          datasourceFilter={datasourceFileFilter}
          validate={required}
        />
      </Box>
      {showOtherConfig && (
        <>
          <Divider />
          <Box pt={4}>
            <ConfigSelector />
          </Box>
        </>
      )}
    </>
  );
}

DataConfiguration.propTypes = {};

export default DataConfiguration;
