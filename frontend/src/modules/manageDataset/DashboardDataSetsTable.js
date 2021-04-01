import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, useTheme } from '@material-ui/core';

import Table from '../../uiComponent/table/Table';
import fileTypes from '../../constants/fileTypes';
import { formatDate } from '../../utils/dateUtils';
import tableStyles from '../../uiComponent/table/tableCSS';
import { convertFileSizeToMB } from '../../utils/helper';
import tableIcon from '../../uiComponent/table/tableIcon';
import DeleteConfirmationModal from '../../uiComponent/DeleteConfirmationModal';
import useModal from '../../hook/useModal';
import DatasourceUsageTooltip from '../../uiComponent/DatasourceUsageTooltip';

function DashboardDataSetsTable({ dataSources, onRemove, onDelete }) {
  const theme = useTheme();
  const styles = tableStyles(theme, dataSources);
  const [selectedRow, setSelectedRow] = useState();
  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  async function deleteDatasource() {
    closeDeleteModal();
    await onDelete(selectedRow);
  }

  function handleDelete(event, rowData) {
    openDeleteModal();
    setSelectedRow(rowData);
  }

  return (
    <>
      <Box width="100%">
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
              title: 'Date Added',
              field: 'createdAt',
              type: 'datetime',
              render: (rowData) => formatDate(rowData.createdAt),
            },
            {
              title: 'Active Dashboard Count',
              field: 'dashboardUsage',
              type: 'numeric',
              tooltip: 'Number of active Dashboards ',
              // eslint-disable-next-line react/prop-types
              render: ({ dashboardUsage, usage }) =>
                dashboardUsage ? (
                  <DatasourceUsageTooltip usage={usage} dashboardUsage={dashboardUsage} />
                ) : (
                  dashboardUsage
                ),

            },
            {
              title: 'Widget Count',
              field: 'widgetUsage',
              type: 'numeric',
              tooltip: 'Number of widget from current dashboard',
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
          actions={[
            (rowData) => ({
              icon: tableIcon.RemoveRow,
              tooltip: 'Remove datasource from dashboard',
              onClick: (event, row) => onRemove(row),
              size: 'small',
              disabled: rowData.widgetUsage > 0,
            }),
            (rowData) => ({
              icon: tableIcon.Delete,
              tooltip: 'Delete Datasource',
              onClick: handleDelete,
              disabled: rowData.dashboardUsage > 0,
              size: 'small',
            }),
          ]}
          style={{
            ...styles.styles,
            border: 'unset',
          }}
        />
      </Box>
      <DeleteConfirmationModal
        handleClose={closeDeleteModal}
        title="Delete Datasource"
        open={isDeleteModalOpen}
        deleteAction={{
          onDelete: deleteDatasource,
          name: 'Delete data source',
          dataTestId: 'delete-datasource',
        }}
      >
        <Typography variant="body2">
          {`Are you sure you want to delete ${selectedRow ? selectedRow.name : ''} datasource ?`}
        </Typography>
      </DeleteConfirmationModal>
    </>
  );
}

DashboardDataSetsTable.propTypes = {
  dataSources: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      fileSize: PropTypes.number,
      fileTypes: PropTypes.string,
      createdAt: PropTypes.string,
    }),
  ).isRequired,
  onRemove: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DashboardDataSetsTable;
