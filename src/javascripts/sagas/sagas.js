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

function* fetchContents(action) {
  try {
    const contents = yield call(api.fetchContents, action.payload.name);
    yield put(impureActions.fetch.contents.succeeded(contents));
  } catch (e) {
    yield put(impureActions.fetch.contents.failed(e));
  }
}

function* fetchArticle(action) {
  try {
    const article = yield call(api.fetchArticle, action.payload.location);
    yield put(impureActions.fetch.article.succeeded(article));
  } catch (e) {
    yield put(impureActions.fetch.article.failed(e));
  }
}

function* saga() {
  yield takeLatest(impureActions.fetch.prof.requested, fetchProf);
  yield takeLatest(impureActions.fetch.contents.requested, fetchContents);
  yield takeLatest(impureActions.fetch.article.requested, fetchArticle);
}

export default saga;