/* /src/javascript/actions/nav.js */
import { createActions } from 'redux-actions';

export const navActions = createActions({
  NAV: {
    SEARCH: {
      VALUE: {
        SET: name => ({ name }),
        RESET: undefined
      },
      BLUR: {
        ENABLE: undefined,
        DISABLE: undefined
      },
      CACHE: {
        PUSH: name => ({ name }),
        CLEAR: undefined
      }
    }
  }
}, { namespace: '_' });