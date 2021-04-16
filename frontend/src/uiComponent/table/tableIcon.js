/* eslint-disable react/prop-types */
import React, { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { RemoveCircleOutlineSharp } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const tableIconStyles = makeStyles((theme) => ({
  colorPrimary: {
    color: theme.colors.primaryColorScale['500'],
  },
  colorDisabled: {
    color: theme.palette.action.disabled,
  },
}));

const tableIcons = {
  Add: createTableIcon(AddBox),
  Check: createTableIcon(Check),
  Clear: createTableIcon(Clear),
  DetailPanel: createTableIcon(ChevronRight),
  Edit: createTableIcon(Edit),
  Export: createTableIcon(SaveAlt),
  Filter: createTableIcon(FilterList),
  FirstPage: createTableIcon(FirstPage),
  LastPage: createTableIcon(LastPage),
  NextPage: createTableIcon(ChevronRight),
  PreviousPage: createTableIcon(ChevronLeft),
  ResetSearch: createTableIcon(Clear),
  Search: createTableIconWithRef(Search),
  SortArrow: createTableIcon(ArrowUpward),
  ThirdStateCheck: createTableIcon(Remove),
  ViewColumn: createTableIcon(ViewColumn),
  RemoveRow: createTableIcon(RemoveCircleOutlineSharp),
  Delete: createTableIcon(DeleteOutline),
};

function createTableIcon(Icon) {
  return ({ disabled, ...rest }) => {
    const IconWithStyles = () => {
      const classes = tableIconStyles();
      return (
        <Icon
          fontSize="small"
          color={disabled ? 'disabled' : 'primary'}
          classes={classes}
          {...rest}
        />
      );
    };
    return <IconWithStyles />;
  };
}

function createTableIconWithRef(Icon) {
  return forwardRef((_, ref) => {
    const classes = tableIconStyles();
    return <Icon fontSize="small" color="primary" classes={classes} ref={ref} />;
  });
}

export default tableIcons;
