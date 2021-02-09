import { call, debounce, fork, put, takeLatest } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import dashboardSaga, {
  autoSave,
  dashboardLoadSaga,
  dashboardUpdateSaga,
  fetchDashboard,
  saveDashboard,
} from '../saga';
import {
  autoSaveComplete,
  autoSaveError,
  autoSaveStarted,
  dashboardLoaded,
  FETCH_DASHBOARD,
  UPDATE_DASHBOARD,
} from '../actions';
import { api } from '../../../utils/api';
import { AUTOSAVE_DEBOUNCE_TIME } from '../constants';

jest.mock('../../../utils/api', () => ({
  api: {
    saveDashboard: jest.fn().mockResolvedValue({
      dashboardId: 'dashboardId',
    }),
    getDashboard: jest.fn().mockResolvedValue({
      dashboard: { name: 'datasource1', _id: 'id' },
    }),
  },
}));

describe('dashboard saga', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register  load and update dashboard saga', () => {
    const it = sagaHelper(dashboardSaga());

    it('should fork dashboard load saga', (result) => {
      expect(result).toEqual(fork(dashboardLoadSaga));
    });

    it('should fork dashboard update saga', (result) => {
      expect(result).toEqual(fork(dashboardUpdateSaga));
    });

    it('and then nothing', (result) => {
      expect(result).toBeUndefined();
    });
  });

  describe('dashboard update saga', () => {
    const it = sagaHelper(dashboardUpdateSaga());

    it('should take latest of update dashboard and call save saga', (result) => {
      expect(result).toEqual(takeLatest(UPDATE_DASHBOARD, autoSave));
    });

    it('should debounce save and call save dashboard saga', (result) => {
      expect(result).toEqual(debounce(AUTOSAVE_DEBOUNCE_TIME, UPDATE_DASHBOARD, saveDashboard));
    });

    it('and then nothing', (result) => {
      expect(result).toBeUndefined();
    });
  });

  describe('dashboard load saga', () => {
    const it = sagaHelper(dashboardLoadSaga());

    it('should take latest of fetch dashboard and call fetch dashboard saga', (result) => {
      expect(result).toEqual(takeLatest(FETCH_DASHBOARD, fetchDashboard));
    });

    it('and then nothing', (result) => {
      expect(result).toBeUndefined();
    });
  });

  describe('should start auto save', () => {
    const action = { payload: { dashboard: { dashboardId: 'id' } } };
    const it = sagaHelper(autoSave(action));

    it('should have put auto save started', (result) => {
      expect(result).toEqual(put(autoSaveStarted('id')));
    });

    it('and then nothing', (result) => {
      expect(result).toBeUndefined();
    });
  });

  describe('should load dashboard', () => {
    const action = { id: 'dashboardId' };
    const it = sagaHelper(fetchDashboard(action));

    it('should have called fetch dashboard api', (result) => {
      expect(result).toEqual(call(api.getDashboard, 'dashboardId'));

      return { dashboardId: 'dashboard' };
    });

    it('and then trigger an action load data in redux', (result) => {
      expect(result).toEqual(put(dashboardLoaded({ dashboardId: 'dashboard' })));
    });

    it('and then nothing', (result) => {
      expect(result).toBeUndefined();
    });
  });

  describe('should save dashboard', () => {
    const dashboard = { dashboard: { dashboardId: 'id' } };
    const it = sagaHelper(saveDashboard({ payload: dashboard }));

    it('should have called save dashboard api', (result) => {
      expect(result).toEqual(call(api.saveDashboard, { dashboardId: 'id' }));
    });

    it('and then trigger an action  to complete auto save', (result) => {
      expect(result).toEqual(put(autoSaveComplete('id')));
    });

    it('and then nothing', (result) => {
      expect(result).toBeUndefined();
    });
  });

  describe('should handle error while saving dashboard', () => {
    api.saveDashboard.mockImplementation(() => Promise.reject('error'));
    const dashboard = { dashboard: { dashboardId: 'id' } };
    const it = sagaHelper(saveDashboard({ payload: dashboard }));

    it('should have called save dashboard api', (result) => {
      expect(result).toEqual(call(api.saveDashboard, { dashboardId: 'id' }));

      return new Error('Something went wrong');
    });

    it('and then trigger an action to handle error during auto save', (result) => {
      expect(result).toEqual(put(autoSaveError('id')));
    });

    it('and then nothing', (result) => {
      expect(result).toBeUndefined();
    });
  });
});
