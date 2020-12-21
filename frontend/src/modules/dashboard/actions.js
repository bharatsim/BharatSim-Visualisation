export const DASHBOARD_LOADED = 'DASHBOARD_LOADED';
export const FETCH_DASHBOARD = 'FETCH_DASHBOARD';
export const UPDATE_DASHBOARD = 'UPDATE_DASHBOARD';
export const AUTO_SAVE_STARTED = 'AUTO_SAVE_STARTED';
export const AUTO_SAVE_COMPLETE = 'AUTO_SAVE_COMPLETE';
export const AUTO_SAVE_ERROR = 'AUTO_SAVE_ERROR';

export const fetchDashboard = (id) => ({ type: FETCH_DASHBOARD, id });
export const updateDashboard = (dashboard) => ({ type: UPDATE_DASHBOARD, payload: { dashboard } });
export const dashboardLoaded = (dashboardData) => ({
  type: DASHBOARD_LOADED,
  payload: dashboardData,
});
export const autoSaveStarted = (dashboardId) => ({
  type: AUTO_SAVE_STARTED,
  payload: { dashboardId },
});
export const autoSaveComplete = (dashboardId) => ({
  type: AUTO_SAVE_COMPLETE,
  payload: { dashboardId },
});
export const autoSaveError = (dashboardId) => ({ type: AUTO_SAVE_ERROR, payload: { dashboardId } });
