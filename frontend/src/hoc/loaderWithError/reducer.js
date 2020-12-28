/* eslint-disable operator-assignment,no-param-reassign */
import produce from 'immer';
import { HIDE_ERROR, SHOW_ERROR, START_LOADER, STOP_LOADER } from './actions';
import { createReducer } from '../redux/reduxHelpers';

const defaultState = { loaderCount: 0, isError: false, errorConfig: null };

const startLoader = produce((state) => {
  state.loaderCount = state.loaderCount + 1;
});

const stopLoader = produce((state) => {
  if (state.loaderCount !== 0) {
    state.loaderCount = state.loaderCount - 1;
  }
});

const showError = produce((state, action) => {
  state.loaderCount = 0;
  state.isError = true;
  state.errorConfig = action.errorConfig;
});

const hideError = produce((state) => {
  state.loaderCount = 0;
  state.isError = false;
  state.errorConfig = null;
});

const reducer = createReducer(defaultState, {
  [START_LOADER]: startLoader,
  [STOP_LOADER]: stopLoader,
  [SHOW_ERROR]: showError,
  [HIDE_ERROR]: hideError,
});

export default reducer;
