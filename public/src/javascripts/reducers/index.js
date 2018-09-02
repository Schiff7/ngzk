import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'
import nav from './nav'

export default combineReducers({ 
  nav,
  form: formReducer
});