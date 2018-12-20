// /src/javascripts/actions/index.js
import { createActions } from 'redux-actions';
import { SEARCH } from './search';

const actions = {
  SEARCH
};

export default createActions(actions, { namespace: '_' });