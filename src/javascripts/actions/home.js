// /src/javascript/actions/home.js
import { createActions } from 'redux-actions';

export const homeActions = createActions({
  HOME: {
    SEARCH: {
      VALUE: {
        SET: (value) => ({ value }),
        RESET: undefined
      },
      CACHE: {
        PUSH: (value) => ({ value }),
        CLEAR: undefined
      }
    }
  }
}, { namespace: '_' })