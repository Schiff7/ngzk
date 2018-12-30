// src/javascript/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createBrowserHistory } from 'history';
import pureReducer from 'reducers';
import impureReducer from 'sagas/reducers';
import saga from 'sagas/sagas';
import createSagaMiddleware from 'redux-saga';
import App from 'routes';
import '@/stylesheets/style.styl';

const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({ pure: pureReducer, impure: impureReducer });

const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.querySelector('#root')
);

sagaMiddleware.run(saga);

