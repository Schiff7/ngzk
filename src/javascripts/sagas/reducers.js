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
      (state, action) => ({ ...state, status: 'succeeded', data: action.payload.prof })
    ],
    [
      impureActions.fetch.prof.failed,
      (state, action) => ({ ...state, status: 'failed', data: null, error: action.payload.error })
    ]
  ]),
  { 
    status: 'initialized', 
    name: '', 
    data: { 
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


const contents = handleActions(
  new Map([
    [
      impureActions.fetch.contents.requested,
      (state, action) => ({ ...state, status: 'pending', name: action.payload.name })
    ],
    [
      impureActions.fetch.contents.succeeded,
      (state, action) => ({ ...state, status: 'succeeded', data: action.payload.contents })
    ],
    [
      impureActions.fetch.contents.failed,
      (state, action) => ({ ...state, status: 'failed', data: null, error: action.payload.error })
    ]
  ]),
  { 
    status: 'initialized', 
    name: '', 
    data: null,
    error: null 
  }
);

const article = handleActions(
  new Map([
    [
      impureActions.fetch.article.requested,
      (state, action) => ({ ...state, status: 'pending', location: action.payload.location})
    ],
    [
      impureActions.fetch.article.succeeded,
      (state, action) => ({ ...state, status: 'succeeded', data: action.payload.article })
    ],
    [
      impureActions.fetch.article.failed,
      (state, action) => ({ ...state, status: 'failed', data: null, error: action.payload.error })
    ]
  ]),
  { 
    status: 'initialized', 
    location: '', 
    data: { 
      url: '', 
      title: '',
      date: '',
      author: '',
      content: '',
    }, 
    error: null 
  }
);

export default combineReducers({ prof, contents, article });