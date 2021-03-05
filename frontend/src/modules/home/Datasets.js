import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@material-ui/core';
import Table from '../../uiComponent/table/Table';
import fileTypes from '../../constants/fileTypes';
import { formatDate } from '../../utils/dateUtils';
import tableStyles from '../../uiComponent/table/tableCSS';
import { convertFileSizeToMB } from '../../utils/helper';
import { api } from '../../utils/api';
import tableIcon from '../../uiComponent/table/tableIcon';

function Datasets() {
  const [dataSources, setDataSources] = useState();
  const theme = useTheme();
  const styles = tableStyles(theme, dataSources);

  async function fetchDatasets() {
    const { dataSources: fetchedDataSources } = await api.getAllDatasources();
    fetchedDataSources.sort(({ usage: usage1 }, { usage: usage2 }) => usage2 - usage1);
    setDataSources(fetchedDataSources);
  }

  async function onDeleteClick(event, rowData) {
    const { _id: datasourceId } = rowData;
    api.deleteDatasource(datasourceId).then(() => {
      setDataSources((prevDatasources) =>
        prevDatasources.filter(({ _id: prevDatasourceID }) => prevDatasourceID !== datasourceId),
      );
    });
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
      data={dataSources}
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
          field: 'usage',
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
        actionsColumnIndex: -1,
      }}
      style={{
        ...styles.styles,
      }}
      actions={[
        (rowData) => ({
          icon: tableIcon.Delete,
          tooltip: 'Delete User',
          onClick: onDeleteClick,
          hidden: rowData.usage > 0,
          iconProps: { 'data-testid': 'delete-datasource' },
          size: 'small',
        }),
      ]}
    />
  );
}

export default Datasets;
