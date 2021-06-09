import React from 'react';
import { Typography, useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import { createColumnForMTable } from '../../utils/fileUploadUtils';
import DataPreviewTableToolBar from './DataPreviewTableToolBar';
import DataPreviewTableHeader from './DataPreviewTableHeader';
import Table from '../../uiComponent/table/Table';
import tableStyles from '../../uiComponent/table/tableCSS';

export default function CsvPreview({ schema, previewData, selectedFile }) {
  const theme = useTheme();
  const styles = tableStyles(theme, previewData);
  return (
    <Box>
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
      <Typography variant="subtitle2" color="textSecondary">
        * File preview for first 100 rows
        <br />* Only YYYY-mm-dd HH:MM:SS.sss date format is supported
      </Typography>
    </Box>
  );
}

CsvPreview.propTypes = {
  selectedFile: PropTypes.objectOf(File).isRequired,
  previewData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  schema: PropTypes.shape({}).isRequired,
};
