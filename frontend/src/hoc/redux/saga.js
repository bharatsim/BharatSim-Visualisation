import { all } from 'redux-saga/effects';

import dashboardSaga from '../../modules/dashboard/saga';

export default function* rootSaga() {
  yield all([dashboardSaga()]);
}
