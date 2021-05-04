import React from 'react';
import { useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import tableStyles from '../../../uiComponent/table/tableCSS';
import { createColumnForMTable } from '../../../utils/fileUploadUtils';
import DataPreviewTableHeader from '../../uploadDataset/DataPreviewTableHeader';
import Table from '../../../uiComponent/table/Table';

export default function DataTable({ schema, data }) {
  const theme = useTheme();
  const styles = tableStyles(theme, data);
  return (
    <Box>
      <Table
        title="DataFile"
        columns={createColumnForMTable(schema)}
        data={data}
        options={{
          showTitle: false,
          search: false,
          toolbar: false,
          paging: false,
          maxBodyHeight: `${theme.spacing(75)}px`,
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
        styles={{ ...styles.styles, height: theme.spacing(100) }}
        components={{
          Header: (props) => <DataPreviewTableHeader {...props} />,
        }}
      />
    </Box>
  );
}

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  schema: PropTypes.shape({}).isRequired,
};
