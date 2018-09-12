/* /public/src/javascript/reducer/nav.js */
import { combineReducers } from 'redux';
import { INPUT, RESET_INPUT, ENABLE_BLUR, DISABLE_BLUR, CACHE_INPUT, CLEAR_CACHE } from 'actions/nav';
import { matches } from 'utils/names';

const hint = (state = { value: '', list: [], visible: 'hide', inputStyle: '' }, action) => {
  const list = matches(action.name);
  switch (action.type) {
    case RESET_INPUT:
      return { ...state, list: [], visible: 'hide', inputStyle: '' };
    case INPUT:
      return list.length === 0 
      ? { value: action.name, list: [], visible: 'hide', inputStyle: '' } 
      : { value: action.name, list, visible:'show-block', inputStyle: 'show-hint' };
    default:
      return state;
  }
}

const blur = (state = { shouldBlur: true }, action) => {
  switch (action.type) {
    case ENABLE_BLUR:
      return { shouldBlur: true };
    case DISABLE_BLUR:
      return { shouldBlur: false };
    default:
      return state;
  }
}



const cache = (state = { history: [] }, action) => {
  const push = (arr, ...items) => { 
    arr.push(...items); 
    return arr; 
  };
  const CACHESIZE = 5;
  const { history } = state;
  switch (action.type) {
    case CACHE_INPUT:
      const next = history.filter(item => item.roma !== action.name.roma).length === history.length && history.length < CACHESIZE
      ? push(history, action.name)
      : history.length >= CACHESIZE
      ? push(history.slice(1), action.name)
      : push(history.filter(item => item.roma !== action.name.roma), action.name);
      console.log(next);
      return { 
        history: next
      };
    case CLEAR_CACHE: 
      return { history: [] }
    default:
      return state;
  }
}

export default combineReducers({ hint, blur, cache });