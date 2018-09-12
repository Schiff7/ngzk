/* /public/src/javascript/index.js */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createStore } from 'redux';
import { createBrowserHistory } from 'history';
import rootReducer from 'reducers';
import Nav from 'containers/nav';
import Home from 'containers/home';
import { Blog } from 'containers';
import '@/stylesheets/style.styl';

const history = createBrowserHistory();

const store = createStore(rootReducer);

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

