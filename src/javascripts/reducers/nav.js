/* /public/src/javascript/reducer/nav.js */
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { navActions } from 'actions/nav';
import { matches } from 'utils/names';

const hint = handleActions(
  new Map([
    [
      navActions.nav.search.value.reset,
      (state, action) => ({
        ...state, list: [], visible: 'hide', inputStyle: ''
      })
    ],
    [
      navActions.nav.search.value.set,
      (state, action) => {
        const { payload: { name } } = action;
        const list = matches(name);
        return (
          list.length === 0
          ? { value: name, list: [], visible: 'hide', inputStyle: '' }
          : { value: name, list, visible:'show-block', inputStyle: 'show-hint' }
        );
      }
    ],
  ]),
  { value: '', list: [], visible: 'hide', inputStyle: '' },
);

const shouldBlur = handleActions(
  new Map(
    [
      navActions.nav.search.blur.enable,
      (state, action) => true
    ],
    [
      navActions.nav.search.blur.disable,
      (state, action) => false
    ]
  ),
  true,
);


const cache = handleActions(
  new Map(
    [
      navActions.nav.search.cache.push,
      (state, action) => {
        const push = (arr, ...items) => { 
          arr.push(...items); 
          return arr; 
        };
        const CACHESIZE = 5;
        const { history } = state;
        const { payload: { name } } = action;
        return (
          history.filter(item => item.roma !== name.roma).length === history.length 
          && history.length < CACHESIZE
          ? push(history, name)
          : history.length >= CACHESIZE
          ? push(history.slice(1), name)
          : push(history.filter(item => item.roma !== name.roma), name)
        );
      }
    ]
  ),
  { history: [] }
);

export default combineReducers({ hint, shouldBlur, cache });