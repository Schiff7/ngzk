/* /public/src/javascript/reducer/nav.js */
import { combineReducers } from 'redux';
import { NAV_HIDE, NAV_LEFT, NAV_TOP } from '../actions/nav';

const display = (state = {
  nav: 'nav-search',
  left: 'hide',
  top: 'show',
}, action) => {
  switch (action.type) {
    case NAV_TOP:
      return { nav: 'nav-search', left: 'hide', top: 'show' };
    case NAV_LEFT:
      return { nav: 'nav-read', left: 'show', top: 'hide' };
    case NAV_HIDE:
      return { nav: 'nav-hide', left: 'hide', top: 'hide' };
    default:
      return state;
  }
}

export default combineReducers({ display });