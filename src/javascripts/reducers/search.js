// src/javascript/reducer/search.js
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import actions from 'actions';

const value = handleActions(
  new Map([
    [ actions.search.value.set, (_, action) => action.payload ]
  ]),
  '',
);


const history = handleActions(
  new Map([
    [
      actions.search.history.push,
      (state, action) => {
        const { items, size } = state;
        const dereplication = items.filter(item => item.name !== action.payload.name );
        if ( dereplication.length === size ) {
          return { ...state, items: ( [ _, ...rest ] = dereplication, rest ) };
        }
        return { ...state, items: [ ...items, action.payload ] };
      }
    ],
    [ actions.search.history.init, (_, action) => ({ ...action.payload }) ],
    [ actions.search.history.clear, (state, _) => ({ ...state, items: [] }) ]
  ]),
  { items: [], size: 0 }
);

export default combineReducers({ value, history });
