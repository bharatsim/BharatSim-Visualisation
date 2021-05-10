import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

import Modal from '../../../uiComponent/Modal';
import CustomColumnBuilderLayout from './CustomColumnBuilderLayout';
import DataTable from './DataTable';
import { api } from '../../../utils/api';
import { transformColumnsDataToRows } from '../../../utils/helper';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '80vw',
    height: `calc(90vh - ${theme.spacing(20)}px)`,
  },
}));

function EditDataSourceModal({ open, handleClose, datasourceId }) {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [schema, setSchema] = useState({});
  const [customColumns, setCustomColumns] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    fetchData();
  }, [customColumns]);

  useEffect(() => {
    fetchDatasourceMetadata();
  }, []);

  return (
    <Modal open={open} handleClose={handleClose} title="Custom Column">
      <Box className={classes.container}>
        <DataTable data={data} schema={schema} />
        <CustomColumnBuilderLayout
          customColumns={customColumns}
          fields={Object.keys(schema).filter((field) => schema[field] === 'Number')}
          selectedTab={selectedTab}
          onColumnCreate={onColumnCreate}
          onAddNewColumn={addNewColumn}
          onDeleteColumn={deleteColumn}
          onTabChange={onTabChange}
        />
      </Box>
    </Modal>
  );

  function onTabChange(event, selectedTabId) {
    setSelectedTab(selectedTabId);
  }

  async function fetchDatasourceMetadata() {
    const { datasourceMetaData } = await api.getDataSourceMetaData(datasourceId);
    const {
      dataSourceSchema: fetchedSchema,
      customColumns: fetchedCustomColumns,
    } = datasourceMetaData;
    setCustomColumns(fetchedCustomColumns.map((column) => ({ ...column, isEditMode: true })));
    setSchema(fetchedSchema);
  }

  async function fetchData() {
    const { data: fetchedData } = await api.getData(datasourceId, [], 5);
    setData(transformColumnsDataToRows(fetchedData));
  }

  function addNewColumn() {
    setCustomColumns((prev) => [
      ...prev,
      { name: 'Untitled column', expression: '', isEditMode: false },
    ]);
    setSelectedTab(customColumns.length);
  }

  async function onColumnCreate({ expression, columnName }) {
    api.addColumn(datasourceId, expression, columnName).then(() => {
      setCustomColumns((prevState) => {
        const columns = [...prevState];
        columns[selectedTab] = { name: columnName, expression, isEditMode: true };
        return columns;
      });
      setSchema((prevSchema) => ({ ...prevSchema, [columnName]: 'Number' }));
      setSelectedTab(selectedTab);
    });
  }

  function deleteCustomColumn(columnIndex) {
    const prevColumnOfSelectedColumn = columnIndex - 1;
    setCustomColumns((prevState) => {
      return prevState.filter((_, index) => columnIndex !== index);
    });
    setSelectedTab(prevColumnOfSelectedColumn > 0 ? prevColumnOfSelectedColumn : 0);
  }

  function onSuccessfulDelete(columnName, columnIndex) {
    setSchema((prevState) => {
      const newSchema = { ...prevState };
      delete newSchema[columnName];
      return newSchema;
    });
    deleteCustomColumn(columnIndex);
  }

  async function deleteColumn() {
    const { name, isEditMode } = customColumns[selectedTab];
    if (!isEditMode) {
      deleteCustomColumn(selectedTab);
      return;
    }
    api.deleteColumn({ columnName: name, datasourceId }).then(() => {
      onSuccessfulDelete(name, selectedTab);
    });
  }
}

EditDataSourceModal.defaultProps = {
  open: false,
};

EditDataSourceModal.propTypes = {
  open: PropTypes.bool,
  datasourceId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default EditDataSourceModal;
