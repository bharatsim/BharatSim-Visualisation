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

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} fontSize="small" />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} fontSize="small" />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} fontSize="small" />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} fontSize="small" />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} fontSize="small" />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} fontSize="small" />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} fontSize="small" />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} fontSize="small" />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} fontSize="small" />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} fontSize="small" />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} fontSize="small" />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} fontSize="small" />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} fontSize="small" />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} fontSize="small" />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} fontSize="small" />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} fontSize="small" />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} fontSize="small" />),
  RemoveRow: forwardRef((props, ref) => (
    <RemoveCircleOutlineSharp {...props} ref={ref} fontSize="small" />
  )),
};

export default tableIcons;
