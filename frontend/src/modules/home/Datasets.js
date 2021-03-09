import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@material-ui/core';
import Table from '../../uiComponent/table/Table';
import fileTypes from '../../constants/fileTypes';
import { formatDate } from '../../utils/dateUtils';
import tableStyles from '../../uiComponent/table/tableCSS';
import { convertFileSizeToMB } from '../../utils/helper';
import { api } from '../../utils/api';
import tableIcon from '../../uiComponent/table/tableIcon';
import useModal from '../../hook/useModal';
import DeleteConfirmationModal from '../../uiComponent/DeleteConfirmationModal';

function Datasets() {
  const [dataSources, setDataSources] = useState();
  const theme = useTheme();
  const styles = tableStyles(theme, dataSources);
  const [selectedRow, setSelectedRow] = useState();
  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  async function fetchDatasets() {
    const { dataSources: fetchedDataSources } = await api.getAllDatasources();
    setDataSources(fetchedDataSources);
  }

  async function deleteDatasource() {
    const { _id: selectedRowId } = selectedRow;
    await api.deleteDatasource(selectedRowId).then(() => {
      setDataSources((prevDatasources) =>
        prevDatasources.filter(({ _id: prevDatasourceID }) => prevDatasourceID !== selectedRowId),
      );
    });
    closeDeleteModal();
  }

  function onDeleteClick(event, rowData) {
    openDeleteModal();
    setSelectedRow(rowData);
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
    <Box>
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
            tooltip: 'Delete Datasource',
            onClick: onDeleteClick,
            disabled: rowData.usage > 0,
            size: 'small',
            'data-testid': 'delete-datasource',
          }),
        ]}
      />
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
          {`Are you sure you want to delete datasource ${selectedRow ? selectedRow.name : ''} ?`}
        </Typography>
      </DeleteConfirmationModal>
    </Box>
  );
}

export default Datasets;
