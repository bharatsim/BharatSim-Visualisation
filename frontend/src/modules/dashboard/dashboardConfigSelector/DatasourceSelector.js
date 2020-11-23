import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { Box, Typography } from '@material-ui/core';
import { api } from '../../../utils/api';
import useFetch from '../../../hook/useFetch';
import { convertObjectArrayToOptionStructure } from '../../../utils/helper';
import Dropdown from '../../../uiComponent/Dropdown';
import { projectLayoutContext } from '../../../contexts/projectLayoutContext';

function DatasourceSelector({ handleDataSourceChange, value, error }) {
  const { selectedDashboardMetadata } = useContext(projectLayoutContext);
  const { _id: selectedDashboardId } = selectedDashboardMetadata;
  const { data: datasources } = useFetch(api.getDatasources, [selectedDashboardId]);

  const dataSources = datasources ? datasources.dataSources : [];

  const isDataSourcePresent = dataSources.length > 0;

  return isDataSourcePresent ? (
    <>
      <Box mb={2}>
        <Typography variant="subtitle2"> Data Source </Typography>
      </Box>
      <Dropdown
        options={convertObjectArrayToOptionStructure(dataSources, 'name', '_id')}
        onChange={handleDataSourceChange}
        id="dropdown-dataSources"
        label="select data source"
        error={error}
        value={value}
      />
    </>
  ) : (
    <Box>
      <Typography>No data source present, upload data source</Typography>
    </Box>
  );
}

DatasourceSelector.defaultProps = {
  error: '',
  value: '',
};

DatasourceSelector.propTypes = {
  handleDataSourceChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  value: PropTypes.string,
};

export default DatasourceSelector;
