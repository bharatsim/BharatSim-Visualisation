import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@material-ui/core';
import Table from '../../uiComponent/table/Table';
import fileTypes from '../../constants/fileTypes';
import { formatDate } from '../../utils/dateUtils';
import tableStyles from '../../uiComponent/table/tableCSS';
import { convertFileSizeToMB } from '../../utils/helper';
import { api } from '../../utils/api';

function transformData(dataSources) {
  const transformed = dataSources.reduce((acc, dataSource) => {
    const { _id: dataSourceId } = dataSource;
    if (!acc[dataSourceId]) {
      acc[dataSourceId] = { count: 0, ...dataSource };
    }
    if (dataSource.dashboardId) {
      acc[dataSourceId].count += 1;
    }
    return acc;
  }, {});
  return Object.values(transformed).sort(({ count: count1 }, { count: count2 }) => {
    return count2 - count1;
  });
}

function Datasets() {
  const [dataSources, setDataSources] = useState();
  const theme = useTheme();
  const styles = tableStyles(theme, dataSources);

  async function fetchDatasets() {
    const { dataSources: fetchedDataSources } = await api.getAllDatasources();
    setDataSources(fetchedDataSources);
  }

  useEffect(() => {
    fetchDatasets();
  }, []);
  if (!dataSources) {
    return null;
  }
  if (dataSources.length === 0) {
    return <Box>No Datasource Found</Box>;
  }
  return (
    <Table
      data={transformData(dataSources)}
      columns={[
        { title: 'Name', field: 'name' },
        {
          title: 'Size',
          field: 'fileSize',
          type: 'numeric',
          render: (rowData) => convertFileSizeToMB(rowData.fileSize),
        },
        { title: 'Type', field: 'fileType', render: (rowData) => fileTypes[rowData.fileType] },
        {
          title: 'Usage',
          field: 'count',
          type: 'numeric',
        },
        {
          title: 'Date Added',
          field: 'createdAt',
          type: 'datetime',
          render: (rowData) => formatDate(rowData.createdAt),
        },
      ]}
      title="table"
      options={{
        toolbar: false,
        paging: false,
        sorting: false,
        headerStyle: {
          ...styles.headerStyle,
          color: theme.palette.text.disabled,
          borderTop: 'none',
          borderBottom: `1px solid ${theme.colors.primaryColorScale['500']}3D`,
        },
      }}
      style={{
        ...styles.styles,
      }}
    />
  );
}

export default Datasets;
