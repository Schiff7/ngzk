/* /src/javascript/index.js */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createBrowserHistory } from 'history';
import pureReducer from 'reducers';
import impureReducer from 'sagas/reducers';
import saga from 'sagas/sagas';
import createSagaMiddleware from 'redux-saga';
import Nav from 'containers/nav';
import Home from 'containers/home';
import { Blog } from 'containers';
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
      <div className='container'>
        <Nav />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/blog/:name' component={Blog} />
        </Switch>
      </div>
    </Router>
  </Provider>,
  document.querySelector('#root')
);

sagaMiddleware.run(saga);

