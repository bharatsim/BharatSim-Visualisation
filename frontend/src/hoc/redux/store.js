import {applyMiddleware, createStore} from "redux";
import createSagaMiddleware from "redux-saga";
import {composeWithDevTools} from "redux-devtools-extension";
import reducer from "./reducer";
import rootSaga from "./saga";


export const composeStore = () => {
    // create the saga middleware
    const sagaMiddleware = createSagaMiddleware();
// mount it on the Store
    const store = createStore(reducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));

// then run the saga
    sagaMiddleware.run(rootSaga);

    return store
}

export default composeStore();