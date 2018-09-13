/* /src/javascript/actions/box.js */
import { createActions } from 'redux-actions';

export const boxActions = createActions({
  BOX: {
    SELECTOR: {
      OPTIONS: {
        SHOW: undefined,
        HIDE: undefined,
        TOGGLE: undefined,
      },
      BLUR: {
        ENABLE: undefined,
        DISABLE: undefined,
      },
      SELECT: value => ({ value })
    }
  }
},{ namespace: '_' });