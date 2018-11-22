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
      (state, action) => {
        const { payload: { value } } = action;
        const list = utils.matches(value).slice(0, 3);
        return (
          list.length === 0
          ? { ...state, value, list: [], visible: 'hide' }
          : { ...state, value, list, visible:'show-block' }
        );
      }
    ],
    [
      homeActions.home.search.current.up,
      (state, _) => {
        const { current, list } = state;
        return { ...state, current: current === 0 ? list.length - 1 : current - 1 };
      }
    ],
    [
      homeActions.home.search.current.down,
      (state, _) => {
        const { current, list } = state;
        return { ...state, current: current === list.length - 1 ? 0 : current + 1 };
      }
    ],
    [
      homeActions.home.search.current.set,
      (state, action) => {
        const { payload: { value } } = action;
        return { ...state, current: value };
      }
    ]
  ]),
  { value: '', list: [], visible: 'hide', current: 0 },
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
