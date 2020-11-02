import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { useTheme } from '@material-ui/core';
import tableIcons from './tableIcon';
import tableStyles from './tableCSS';

function Table({ columns, data, title, options, ...rest }) {
  const theme = useTheme();
  const styles = tableStyles(theme, data);
  return (
    <MaterialTable
      icons={tableIcons}
      title={title}
      columns={columns}
      data={data}
      options={{
        rowStyle: (_, index) => styles.rowStyles(index),
        cellStyle: styles.cellStyle(),
        headerStyle: styles.headerStyle,
        emptyRowsWhenPaging: false,
        disableGutters: true,
        pageSize: 10,
        draggable: false,
        ...options,
      }}
      style={styles.styles}
      {...rest}
    />
  );
}

Table.defaultProps = {
  options: {},
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.shape({}),
};

export default Table;
