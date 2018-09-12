/* /public/src/javascript/reducer/box.js */
import { combineReducers } from 'redux';
import { SHOW_OPTIONS, HIDE_OPTIONS, TOGGLE_OPTIONS, SELECT, BOX_ENABLE_BLUR, BOX_DISABLE_BLUR } from 'actions/box';

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

const selectedValue = (state = '', action) => {
  switch (action.type) {
    case SELECT:
      return action.value;
    default:
      return state;
  }
}

const blur = (state = { shouldBlur: true }, action) => {
  switch (action.type) {
    case BOX_ENABLE_BLUR:
      return { shouldBlur: true };
    case BOX_DISABLE_BLUR:
      return { shouldBlur: false };
    default:
      return state;
  }
}

export default combineReducers({ options, selectedValue, blur });