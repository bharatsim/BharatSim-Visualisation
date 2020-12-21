import {runSaga} from 'redux-saga';
import {debounce, fork, takeLatest} from 'redux-saga/effects';
import dashboardSaga, {autoSave, dashboardLoadSaga, dashboardUpdateSaga, fetchDashboard, saveDashboard} from '../saga'
import {
    autoSaveComplete, autoSaveError, autoSaveStarted,
    DASHBOARD_LOADED,
    FETCH_DASHBOARD,
    fetchDashboard as fetchAction,
    UPDATE_DASHBOARD,
    updateDashboard as updateAction
} from "../actions";
import {api} from '../../../utils/api';
import {AUTOSAVE_DEBOUNCE_TIME} from "../constants";

jest.mock('../../../utils/api', () => ({
    api: {
        saveDashboard: jest.fn().mockResolvedValue({
            dashboardId: 'dashboardId',
        }),
        getDashboard: jest.fn().mockResolvedValue({
            dashboard: {name: 'datasource1', _id: 'id'},
        })
    },
}));
describe('dashboard saga', () => {
    afterEach(()=>{
        jest.clearAllMocks()
    })
    it("should register load and update dashboard", () => {
        const rootSaga = dashboardSaga();
        expect(rootSaga.next().value).toEqual(fork(dashboardLoadSaga))
        expect(rootSaga.next().value).toEqual(fork(dashboardUpdateSaga))
    })

    it("should load dashboard", async () => {
        const dispatched = [];
        const loadSaga = dashboardLoadSaga();
        expect(loadSaga.next().value).toEqual(takeLatest(FETCH_DASHBOARD, fetchDashboard))
        await runSaga({dispatch: action => dispatched.push(action)}, fetchDashboard, fetchAction("id")).toPromise()

        expect(dispatched).toEqual([{
            type: DASHBOARD_LOADED, payload: {
                dashboard: {name: 'datasource1', _id: 'id'},
            }
        }])
        expect(api.getDashboard).toHaveBeenCalledWith("id")

    })

    it("should save dashboard", async () => {
        const dispatched = [];
        const updateSaga = dashboardUpdateSaga();
        expect(updateSaga.next().value).toEqual(takeLatest(UPDATE_DASHBOARD, autoSave))
        expect(updateSaga.next().value).toEqual(debounce(AUTOSAVE_DEBOUNCE_TIME, UPDATE_DASHBOARD, saveDashboard))

        await runSaga({dispatch: action => dispatched.push(action)}, autoSave, updateAction({dashboardId: "id"}))
            .toPromise()
        await runSaga({dispatch: action => dispatched.push(action)}, saveDashboard, updateAction({dashboardId: "id"}))
            .toPromise()

        expect(dispatched).toEqual([autoSaveStarted("id"),autoSaveComplete("id")])
        expect(api.saveDashboard).toHaveBeenCalledWith({dashboardId: "id"})
        expect(api.saveDashboard).toHaveBeenCalledWith({dashboardId: "id"})

    })

    it("should handle error on save dashboard", async () => {
        api.saveDashboard.mockImplementation(()=> Promise.reject("error"))
        const dispatched = [];
        await runSaga({dispatch: action => dispatched.push(action)}, saveDashboard, updateAction({dashboardId: "id"}))
            .toPromise()

        expect(dispatched).toEqual([autoSaveError("id")])
        expect(api.saveDashboard).toHaveBeenCalledWith({dashboardId: "id"})

    })
})