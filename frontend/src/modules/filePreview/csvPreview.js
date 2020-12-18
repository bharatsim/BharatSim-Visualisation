import React from 'react';
import { useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';
import { createColumnForMTable } from '../../utils/fileUploadUtils';
import DataPreviewTableToolBar from '../uploadDataset/DataPreviewTableToolBar';
import DataPreviewTableHeader from '../uploadDataset/DataPreviewTableHeader';
import Table from '../../uiComponent/table/Table';
import tableStyles from '../../uiComponent/table/tableCSS';

export default function CsvPreview({ schema, previewData, selectedFile }) {
  const theme = useTheme();
  const styles = tableStyles(theme, previewData);
  return (
    <Table
      title="DataFile"
      columns={createColumnForMTable(schema)}
      data={previewData}
      options={{
        paging: true,
        showTitle: false,
        search: false,
        headerStyle: {
          ...styles.headerStyle,
          padding: theme.spacing(1, 2, 1, 2),
          borderBottom: 'unset',
        },
        cellStyle: () => ({
          ...styles.cellStyle(),
          color: theme.palette.text.secondary,
        }),
      }}
      components={{
        Toolbar: (props) => <DataPreviewTableToolBar {...props} file={selectedFile} />,
        Header: (props) => <DataPreviewTableHeader {...props} />,
      }}
    />
  );
}

CsvPreview.propTypes = {
  selectedFile: PropTypes.objectOf(File).isRequired,
  previewData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  schema: PropTypes.shape({}).isRequired,
};
