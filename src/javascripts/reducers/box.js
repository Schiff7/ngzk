/* /public/src/javascript/reducer/box.js */
import { combineReducers } from 'redux';
import { boxActions } from 'actions/box';
import { handleActions } from 'redux-actions';

const options = handleActions(
  new Map(
    [
      boxActions.box.selector.options.show,
      (state, action) => ({ visible: 'show-block', inputStyle: 'show-options' })
    ],
    [
      boxActions.box.selector.options.hide,
      (state, action) => ({ visible: 'hide', inputStyle: '' })
    ],
    [
      boxActions.box.selector.options.toggle,
      (state, action) => (
        state.visible === 'hide'
        ? { visible: 'show-block', inputStyle: 'show-options' }
        : { visible: 'hide', inputStyle: '' }
      )
    ]
  ),
  { visible: 'hide', inputStyle: '' }
);


const selectedValue = handleActions(
  new Map(
    [
      boxActions.box.selector.select,
      (state, action) => action.payload.value
    ]
  ),
  ''
);

const shouldBlur = handleActions(
  new Map(
    [
      boxActions.box.selector.blur.enable,
      (state, action) => true
    ],
    [
      boxActions.box.selector.blur.disable,
      (state, action) => false
    ]
  ),
  true,
);

export default combineReducers({ options, selectedValue, shouldBlur });