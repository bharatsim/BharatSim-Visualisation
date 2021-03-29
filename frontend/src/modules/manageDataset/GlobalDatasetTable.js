import React from 'react';
import PropTypes from 'prop-types';
import { Box, useTheme } from '@material-ui/core';
import { MTableHeader } from 'material-table';
import Table from '../../uiComponent/table/Table';
import fileTypes from '../../constants/fileTypes';
import { formatDate } from '../../utils/dateUtils';
import { convertFileSizeToMB } from '../../utils/helper';
import tableStyles from '../../uiComponent/table/tableCSS';
import DatasetTableToolBar from './DatasetTableToolBar';

function isSelectedCheckBox(datasourceId, selectedDatasources) {
  return selectedDatasources.some(
    ({ _id: selectedDatasourceId }) => datasourceId === selectedDatasourceId,
  );
}

function GlobalDatasetTable({ dataSources, onAddDatasourceClick, selectedDatasources }) {
  const theme = useTheme();
  const styles = tableStyles(theme, dataSources);

  return (
    <Box>
      <Table
        components={{
          Toolbar: (props) => (
            <DatasetTableToolBar {...props} onAddDatasourceClick={onAddDatasourceClick} />
          ),
          Header: (props) => <MTableHeader {...props} showSelectAllCheckbox={false} />,
        }}
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
            tooltip: 'Number of Dashboards which has widgets created',
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
          toolbar: true,
          paging: false,
          sorting: false,
          selection: true,
          headerStyle: {
            ...styles.headerStyle,
            color: theme.palette.text.disabled,
            borderTop: 'none',
            borderBottom: `1px solid ${theme.colors.primaryColorScale['500']}3D`,
          },
          selectionProps: ({ _id: datasourceId }) => ({
            size: 'small',
            color: 'primary',
            ...(isSelectedCheckBox(datasourceId, selectedDatasources)
              ? {
                  disabled: true,
                  checked: true,
                }
              : {}),
          }),
          headerSelectionProps: {
            size: 'small',
            color: 'primary',
          },
          actionsColumnIndex: -1,
        }}
        style={{
          ...styles.styles,
        }}
      />
    </Box>
  );
}

GlobalDatasetTable.propTypes = {
  dataSources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onAddDatasourceClick: PropTypes.func.isRequired,
  selectedDatasources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default GlobalDatasetTable;
