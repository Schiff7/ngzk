/* /public/src/javascript/index.js */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import rootReducer from 'reducers';
import Nav from 'containers/nav';
import { Blog } from 'containers';
import '@/stylesheets/style.styl';

const history = createBrowserHistory();

const store = createStore(
  connectRouter(history)(rootReducer),
  compose(
    applyMiddleware(
      routerMiddleware(history),
    ),
  ),
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div className='container'>
        <Nav />
        <Switch>
          <Route exact path='/' component={Blog} />
        </Switch>
      </div>
    </ConnectedRouter>
  </Provider>,
  document.querySelector('#root')
);

