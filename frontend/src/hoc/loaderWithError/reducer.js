import {HIDE_ERROR, SHOW_ERROR, START_LOADER, STOP_LOADER} from "./actions";

const defaultState = {loaderCount: 0, isError: false, errorConfig: null}

const reducer =  (state = defaultState, action) => {
    switch (action.type) {
        case START_LOADER:
            return {...state, loaderCount: state.loaderCount + 1}
        case STOP_LOADER:
            if (state.loaderCount !== 0) {
                return {...state, loaderCount: state.loaderCount - 1}
            }
            return state
        case SHOW_ERROR:
            return {loaderCount: 0, isError: true, errorConfig: action.errorConfig}
        case HIDE_ERROR:
            return {loaderCount: 0, isError: false, errorConfig: null}
        default:
            return state

    }
}
export default reducer