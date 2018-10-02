/* /src/sagas/sagas.js */
import { call, put, takeLatest } from 'redux-saga/effects';
import { impureActions } from './actions';
import api from './api';


function* fetchProf(action) {
  try {
    const prof = yield call(api.fetchProf, action.payload.name);
    yield put(impureActions.fetch.prof.succeeded(prof));
  } catch (e) {
    yield put(impureActions.fetch.prof.failed(e));
  }

}

function* saga() {
  yield takeLatest(impureActions.fetch.prof.requested, fetchProf);
}

export default saga;