/* /public/src/javascript/reducer/nav.js */
import { combineReducers } from 'redux';
import { SUBMIT, INPUT, RESET_INPUT } from '../actions/nav';
import { matches } from '../utils/names';

const person = (state = { name: '' }, action) => {
  switch (action.type) {
    case SUBMIT:
      return { name: action.name };
    default:
      return state;
  }
}

const hint = (state = { list: [], visible: 'hide', inputStyle: '' }, action) => {
  const defaultState = { list: [], visible: 'hide', inputStyle: '' };
  const list = matches(action.name);
  switch (action.type) {
    case RESET_INPUT:
      return defaultState;
    case INPUT:
      return list.length === 0 ? defaultState : { list, visible:'show-block', inputStyle: 'show-hint' };
    default:
      return state;
  }
}

export default combineReducers({ person, hint });