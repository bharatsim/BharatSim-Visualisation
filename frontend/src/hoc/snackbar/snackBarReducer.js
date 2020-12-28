/* eslint-disable no-param-reassign */
import produce from 'immer';
import { createReducer } from '../redux/reduxHelpers';
import { ENQUEUE_SNACKBAR, REMOVE_SNACKBAR } from './snackBarActions';

const defaultState = {
  notifications: [],
};

const enqueueSnackbar = produce((state, action) => {
  state.notifications.push({
    key: action.key,
    ...action.notification,
  });
});

const removeSnackbar = produce((state, action) => {
  state.notifications = state.notifications.filter(
    (notification) => notification.key !== action.key,
  );
});

const reducer = createReducer(defaultState, {
  [ENQUEUE_SNACKBAR]: enqueueSnackbar,
  [REMOVE_SNACKBAR]: removeSnackbar,
});

export default reducer;
