import { combineReducers } from 'redux';
import snackBarReducer from '../snackbar/snackBarReducer';
import loaderOrErrorReducer from '../loaderWithError/reducer';
import dashboardReducer from '../../modules/dashboard/reducer';

export default combineReducers({
  snackBar: snackBarReducer,
  loaderOrError: loaderOrErrorReducer,
  dashboards: dashboardReducer,
});
