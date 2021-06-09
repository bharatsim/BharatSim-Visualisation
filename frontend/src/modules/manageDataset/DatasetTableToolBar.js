import React from 'react';
import PropTypes from 'prop-types';
import { MTableToolbar } from 'material-table';
import { Box, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../../theme/theme';

const useTableToolbarStyles = makeStyles(() => ({
  title: {
    overflow: 'unset',
  },
}));

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 3, 2, 0),
    borderBottom: `1px solid ${theme.colors.tableBorder}`,
  },
  subtitle2: {
    whiteSpace: 'nowrap',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

function DatasetTableToolBar(props) {
  const tableToolbarClasses = useTableToolbarStyles();
  const classes = useStyles();
  const { selectedRows, onAddDatasourceClick } = props;

  function handleAddToDatasourceClick() {
    onAddDatasourceClick(selectedRows);
  }

  return (
    <Box className={classes.root}>
      <MTableToolbar
        {...props}
        title={
          <Typography variant="subtitle2" className={classes.subtitle2}>
            Dataset Library
          </Typography>
        }
        showTextRowsSelected={false}
        classes={tableToolbarClasses}
        searchFieldAlignment="left"
        searchFieldVariant="outlined"
        selectedRows={[]}
      />
      <Box className={classes.actions}>
        <Typography variant="body1">{`${selectedRows.length} item(s) selected`}</Typography>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleAddToDatasourceClick}
          disabled={selectedRows.length <= 0}
        >
          Add to dashboard
        </Button>
      </Box>
    </Box>
  );
}

DatasetTableToolBar.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onAddDatasourceClick: PropTypes.func.isRequired,
};

export default DatasetTableToolBar;
