/* /public/src/javascript/reducer/box.js */
import { combineReducers } from 'redux';
import { SHOW_OPTIONS, HIDE_OPTIONS, TOGGLE_OPTIONS } from 'actions/box';

const options = (state = { visible: 'hide', inputStyle: '' }, action) => {
  switch (action.type) {
    case SHOW_OPTIONS:
      return { visible: 'show-block', inputStyle: 'show-options' }
    case HIDE_OPTIONS:
      return { visible: 'hide', inputStyle: '' }
    case TOGGLE_OPTIONS:
      return state.visible === 'hide'
      ? { visible: 'show-block', inputStyle: 'show-options' }
      : { visible: 'hide', inputStyle: '' }
    default:
      return state;
  }
}

export default combineReducers({ options });