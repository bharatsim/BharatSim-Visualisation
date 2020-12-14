import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
import rootSaga from "./saga";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
// mount it on the Store
export default createStore(reducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));

// then run the saga
sagaMiddleware.run(rootSaga);