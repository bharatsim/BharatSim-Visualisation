import {enqueueSnackbar, removeSnackbar} from '../snackBarActions'
import reducer from '../snackBarReducer'

jest.mock('../../../utils/uniqKeyGenerator',()=> () => "uniqKey")
describe("SnackBar Reducer ",()=>{
    const initialState = {
        notifications: [],
    };

    it("should enqueue the notification",()=>{
        const notification = {msg: "success"}
        const action = enqueueSnackbar(notification);
        const nextState = reducer(initialState, action)
        expect(nextState.notifications).toEqual([{ key: "uniqKey",...notification}])
    })

    it("should remove the notification",()=>{
        const notification = {msg: "success", key: "key1"}
        const action = removeSnackbar(notification.key);
        const nextState = reducer({notifications:[notification]}, action)
        expect(nextState.notifications).toEqual([])
    })

})