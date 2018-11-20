// /src/javascript/reducer/home.js
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { homeActions } from 'actions/home';
import utils from 'utils';

const hint = handleActions(
  new Map([
    [
      homeActions.home.search.value.reset,
      (state, _) => ({
        ...state, list: [], visible: 'hide'
      })
    ],
    [
      homeActions.home.search.value.set,
      (_, action) => {
        const { payload: { value } } = action;
        const list = utils.matches(value).slice(0, 3);
        return (
          list.length === 0
          ? { value, list: [], visible: 'hide' }
          : { value, list, visible:'show-block' }
        );
      }
    ],
    [
      homeActions.home.search.current.select,
      (state, action) => {
        const { payload: { keyCode } } = action;
        const { current } = state;
        switch (keyCode) {
          case 38:
            return { current: current - 1, ...state };
          case 40:
            return { current: current + 1, ...state };
          default:
            return state;
        }
      }
    ]
  ]),
  { value: '', list: [], visible: 'hide', current: -1 },
);


const cache = handleActions(
  new Map([
    [
      homeActions.home.search.cache.push,
      (state, action) => {
        const push = (arr, ...items) => { 
          arr.push(...items); 
          return arr; 
        };
        const CACHESIZE = 5;
        const { history } = state;
        const { payload: { value } } = action;
        const next = history.filter(item => item.roma !== value.roma).length === history.length 
          && history.length < CACHESIZE
          ? push(history, value)
          : history.length >= CACHESIZE
          ? push(history.slice(1), value)
          : push(history.filter(item => item.roma !== value.roma), value);
        return { history: next };
      }
    ],
    [
      homeActions.home.search.cache.clear,
      () => ({ history: [] })
    ]
  ]),
  { history: [] }
);

export default combineReducers({ hint, cache });
