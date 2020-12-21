import {
  AUTO_SAVE_COMPLETE,
  AUTO_SAVE_ERROR,
  AUTO_SAVE_STARTED,
  DASHBOARD_LOADED,
  UPDATE_DASHBOARD,
} from './actions';

const initialState = { dashboards: {}, autoSaveStatus: {} };

const updateDashboard = (dashboardId, dashboard, state) => ({
  ...state,
  dashboards: { ...state.dashboards, [dashboardId]: dashboard },
});
const updateAutoSaveStatus = (dashboardId, autoSaveStatus, state) => ({
  ...state,
  autoSaveStatus: { ...state.autoSaveStatus, [dashboardId]: autoSaveStatus },
});

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case DASHBOARD_LOADED:
      return updateDashboard(payload.dashboard._id, payload.dashboard, state);

    case UPDATE_DASHBOARD:
      return updateDashboard(payload.dashboard.dashboardId, payload.dashboard, state);

    case AUTO_SAVE_STARTED:
      return updateAutoSaveStatus(
        payload.dashboardId,
        { saving: true, error: false, lastSaved: null },
        state,
      );

    case AUTO_SAVE_COMPLETE:
      return updateAutoSaveStatus(
        payload.dashboardId,
        {
          saving: false,
          error: false,
          lastSaved: new Date(),
        },
        state,
      );

    case AUTO_SAVE_ERROR:
      return updateAutoSaveStatus(
        payload.dashboardId,
        {
          saving: false,
          error: true,
          lastSaved: null,
        },
        state,
      );

    default:
      return state;
  }
};
