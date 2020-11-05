import React from 'react';
import PropTypes from 'prop-types';

import { Box, Typography } from '@material-ui/core';
import Dropdown from '../../uiComponent/Dropdown';

import useFetch from '../../hook/useFetch';
import { api } from '../../utils/api';
import { convertObjectArrayToOptionStructure } from '../../utils/helper';

function DatasourceSelector({ handleDataSourceChange, value, error }) {
  const { data: datasources } = useFetch(api.getDatasources);

  const dataSources = datasources ? datasources.dataSources : [];

  const isDataSourcePresent = dataSources.length > 0;

  return isDataSourcePresent ? (
    <Dropdown
      options={convertObjectArrayToOptionStructure(dataSources, 'name', '_id')}
      onChange={handleDataSourceChange}
      id="dropdown-dataSources"
      label="select data source"
      error={error}
      value={value}
    />
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
