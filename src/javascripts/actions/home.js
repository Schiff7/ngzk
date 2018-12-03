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
      },
      CURRENT: {
        UP: undefined,
        DOWN: undefined,
        SET: (value) => ({ value }),
        RESET: undefined
      }
    },
    SLIDER: {
      SCROLL: {
        INIT: (limit, size) => ({ limit, size }),
        UP: undefined,
        DOWN: undefined
      }
    }
  }
}, { namespace: '_' })