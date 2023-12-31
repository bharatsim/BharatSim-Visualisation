import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import Table from '../../uiComponent/table/Table';
import fileTypes from '../../constants/fileTypes';
import { formatDate } from '../../utils/dateUtils';
import tableStyles from '../../uiComponent/table/tableCSS';
import { convertFileSizeToMB } from '../../utils/helper';
import { api } from '../../utils/api';
import tableIcon from '../../uiComponent/table/tableIcon';
import useModal from '../../hook/useModal';
import DeleteConfirmationModal from '../../uiComponent/DeleteConfirmationModal';
import snackbarVariant from '../../constants/snackbarVariant';
import DatasourceUsageTooltip from '../../uiComponent/DatasourceUsageTooltip';

function Datasets() {
  const [dataSources, setDataSources] = useState();
  const theme = useTheme();
  const styles = tableStyles(theme, dataSources);
  const [selectedRow, setSelectedRow] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { SUCCESS } = snackbarVariant;
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
    closeDeleteModal();
    await api.deleteDatasource(selectedRowId).then(() => {
      enqueueSnackbar(`Successfully deleted ${selectedRow.name} datasource`, {
        variant: SUCCESS,
      });
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
            title: 'Date Added',
            field: 'createdAt',
            type: 'datetime',
            render: (rowData) => formatDate(rowData.createdAt),
          },
          {
            title: 'Active Dashboard Count',
            field: 'dashboardUsage',
            type: 'numeric',
            tooltip: 'Number of Dashboards which has widgets created',
            // eslint-disable-next-line react/prop-types
            render: ({ dashboardUsage, usage }) =>
              dashboardUsage ? (
                <DatasourceUsageTooltip usage={usage} dashboardUsage={dashboardUsage} />
              ) : (
                dashboardUsage
              ),
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
            tooltip: 'Delete datasource',
            onClick: onDeleteClick,
            disabled: rowData.dashboardUsage > 0,
            size: 'small',
          }),
        ]}
      />
      <DeleteConfirmationModal
        handleClose={closeDeleteModal}
        title="Delete datasource"
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
    </Box>
  );
}

export default Datasets;
