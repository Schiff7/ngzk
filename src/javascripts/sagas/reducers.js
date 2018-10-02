// /src/javascripts/sagas/reducers.js
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { impureActions } from './actions';

const prof = handleActions(
  new Map([
    [
      impureActions.fetch.prof.requested,
      (state, action) => ({ ...state, status: 'pending', name: action.payload.name })
    ],
    [
      impureActions.fetch.prof.succeeded,
      (state, action) => ({ ...state, status: 'succeeded', info: action.payload.prof })
    ],
    [
      impureActions.fetch.prof.failed,
      (state, action) => ({ ...state, status: 'failed', info: null, error: action.payload.error })
    ]
  ]),
  { 
    status: 'initialized', 
    name: '', 
    info: { 
      name: '', 
      hiragana: '',
      birthdate: '',
      abo: '',
      constellation: '',
      stature: '',
    }, 
    error: null 
  }
);

export default combineReducers({ prof });