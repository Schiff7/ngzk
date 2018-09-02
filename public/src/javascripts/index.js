/* /public/src/javascript/index.js */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import Nav from './containers/nav';
import '../stylesheets/style.styl';

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}><Nav /></Provider>,
  document.querySelector('#root')
);

