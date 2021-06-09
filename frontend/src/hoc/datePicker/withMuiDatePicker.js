import React from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

export default (WrappedComponent) => (props) =>
  (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <WrappedComponent {...props} />
    </MuiPickersUtilsProvider>
  );
