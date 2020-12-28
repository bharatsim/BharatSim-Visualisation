import reducer from '../reducer';
import {
  autoSaveComplete,
  autoSaveError,
  autoSaveStarted,
  dashboardLoaded,
  updateDashboard,
} from '../actions';

describe('dashboard reducer', () => {
  const initialState = { autoSaveStatus: {}, dashboards: {} };
  const existingState = {
    autoSaveStatus: { '101': { saving: true } },
    dashboards: { '101': { name: 'existing' } },
  };
  const mockDate = new Date(1466424490000);

  let dateSpy;

  beforeAll(() => {
    dateSpy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });

  afterAll(() => {
    dateSpy.mockRestore();
  });

  it('should ignore unknown action', () => {
    const nextState = reducer(undefined, { type: 'UnkownAction' });
    expect(nextState).toEqual(initialState);
  });

  it('should load dashboard', () => {
    const dashboardId = '1';
    const dashboard = { _id: dashboardId, name: 'dashboard' };
    const nextState = reducer(existingState, dashboardLoaded({ dashboard }));
    expect(nextState).toEqual({
      ...existingState,
      dashboards: { ...existingState.dashboards, [dashboardId]: dashboard },
    });
  });

  it('should update dashboard', () => {
    const dashboard = { dashboardId: '1', name: 'dashboard' };
    const nextState = reducer(existingState, updateDashboard(dashboard));

    expect(nextState).toEqual({
      ...existingState,
      dashboards: { ...existingState.dashboards, [dashboard.dashboardId]: dashboard },
    });
  });
  it('should start auto save', () => {
    const dashboardId = '1';
    const nextState = reducer(existingState, autoSaveStarted(dashboardId));
    expect(nextState).toEqual({
      ...existingState,
      autoSaveStatus: {
        ...existingState.autoSaveStatus,
        [dashboardId]: { saving: true, error: false, lastSaved: null },
      },
    });
  });

  it('should complete auto save', () => {
    const dashboardId = '1';
    const nextState = reducer(existingState, autoSaveComplete(dashboardId));
    expect(nextState).toEqual({
      ...existingState,
      autoSaveStatus: {
        ...existingState.autoSaveStatus,
        [dashboardId]: { saving: false, error: false, lastSaved: mockDate },
      },
    });
  });

  it('should show error for auto save', () => {
    const dashboardId = '1';
    const nextState = reducer(existingState, autoSaveError(dashboardId));
    expect(nextState).toEqual({
      ...existingState,
      autoSaveStatus: {
        ...existingState.autoSaveStatus,
        [dashboardId]: { saving: false, error: true, lastSaved: null },
      },
    });
  });
});
