import {combineReducers} from "redux";
import snackBarReducer from '../snackbar/snackBarReducer'
import loaderOrErrorReducer from '../loaderWithError/reducer'

export default combineReducers({snackBar: snackBarReducer, loaderOrError: loaderOrErrorReducer})

