import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable, { MTableAction } from 'material-table';
import { useTheme } from '@material-ui/core';
import tableIcons from './tableIcon';
import tableStyles from './tableCSS';
import './table.css';

function Table({ columns, data, title, options, components, ...rest }) {
  const theme = useTheme();
  const styles = tableStyles(theme, data);
  return (
    <MaterialTable
      components={{
        ...components,
        Action: (props) => <MTableAction {...props} size="small" />,
      }}
      icons={tableIcons}
      title={title}
      columns={columns}
      data={data}
      options={{
        rowStyle: (_, index) => styles.rowStyles(index),
        cellStyle: styles.cellStyle(),
        actionsCellStyle: styles.actionCell,
        filterCellStyle: styles.cellStyle(),
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
  components: {},
};

Table.propTypes = {
  components: PropTypes.shape({}),
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.shape({}),
};

export default Table;
