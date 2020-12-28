import { call, debounce, fork, put, takeLatest } from 'redux-saga/effects';
import { api } from '../../utils/api';

import {
  autoSaveComplete,
  autoSaveError,
  autoSaveStarted,
  dashboardLoaded,
  FETCH_DASHBOARD,
  UPDATE_DASHBOARD,
} from './actions';
import { AUTOSAVE_DEBOUNCE_TIME } from './constants';

export function* fetchDashboard(action) {
  const dashbaord = yield call(api.getDashboard, action.id);
  yield put(dashboardLoaded(dashbaord));
}

export function* saveDashboard(action) {
  const { dashboard } = action.payload;
  try {
    yield call(api.saveDashboard, dashboard);
    yield put(autoSaveComplete(dashboard.dashboardId));
  } catch (e) {
    yield put(autoSaveError(dashboard.dashboardId));
  }
}

export function* autoSave(action) {
  const { dashboard } = action.payload;
  yield put(autoSaveStarted(dashboard.dashboardId));
}

export function* dashboardLoadSaga() {
  yield takeLatest(FETCH_DASHBOARD, fetchDashboard);
}

export function* dashboardUpdateSaga() {
  yield takeLatest(UPDATE_DASHBOARD, autoSave);
  yield debounce(AUTOSAVE_DEBOUNCE_TIME, UPDATE_DASHBOARD, saveDashboard);
}

export default function* dashboardSaga() {
  yield fork(dashboardLoadSaga);
  yield fork(dashboardUpdateSaga);
}
