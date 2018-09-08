import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import nav from './nav';
import box from './box';

export default combineReducers({ 
  nav,
  box,
  form: formReducer
});