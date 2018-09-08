/* /public/src/javascript/reducer/nav.js */
import { combineReducers } from 'redux';
import { INPUT, RESET_INPUT } from 'actions/nav';
import { matches } from 'utils/names';

const hint = (state = { list: [], visible: 'hide', inputStyle: '' }, action) => {
  const list = matches(action.name);
  switch (action.type) {
    case RESET_INPUT:
      return { list: [], visible: 'hide', inputStyle: '' };
    case INPUT:
      return list.length === 0 
      ? { list: [], visible: 'hide', inputStyle: '' } 
      : { list, visible:'show-block', inputStyle: 'show-hint' };
    default:
      return state;
  }
}

export default combineReducers({ hint });