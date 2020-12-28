/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  AUTO_SAVE_COMPLETE,
  AUTO_SAVE_ERROR,
  AUTO_SAVE_STARTED,
  DASHBOARD_LOADED,
  UPDATE_DASHBOARD,
} from './actions';
import { createReducer } from '../../hoc/redux/reduxHelpers';

const initialState = { dashboards: {}, autoSaveStatus: {} };

const updateDashboard = produce((state, { payload }) => {
  const { dashboardId } = payload.dashboard;
  state.dashboards[dashboardId] = payload.dashboard;
});

const loadDashboard = produce((state, { payload }) => {
  const { _id: dashboardId } = payload.dashboard;
  state.dashboards[dashboardId] = payload.dashboard;
});

const autoSaveStarted = produce((state, { payload }) => {
  const { dashboardId } = payload;
  state.autoSaveStatus[dashboardId] = { saving: true, error: false, lastSaved: null };
});

const autoSaveComplete = produce((state, { payload }) => {
  const { dashboardId } = payload;
  state.autoSaveStatus[dashboardId] = {
    saving: false,
    error: false,
    lastSaved: new Date(),
  };
});

const autoSaveError = produce((state, { payload }) => {
  const { dashboardId } = payload;
  state.autoSaveStatus[dashboardId] = {
    saving: false,
    error: true,
    lastSaved: null,
  };
});

const dashboardReducer = createReducer(initialState, {
  [AUTO_SAVE_COMPLETE]: autoSaveComplete,
  [AUTO_SAVE_ERROR]: autoSaveError,
  [AUTO_SAVE_STARTED]: autoSaveStarted,
  [DASHBOARD_LOADED]: loadDashboard,
  [UPDATE_DASHBOARD]: updateDashboard,
});

export default dashboardReducer;
