// /src/javascripts/sagas/actions.js
import { createActions } from 'redux-actions';

export const impureActions = createActions({
  FETCH: {
    PROF: {
      REQUESTED: (name) => ({ name }),
      SUCCEEDED: (prof) => ({ prof }),
      FAILED: (error) => error
    },
    BLOG: {
      REQUESTED: () => {},
      SUCCEEDED: () => {},
      FAILED: (error) => error
    },
    CONTENTS: {
      REQUESTED: () => {},
      SUCCEEDED: () => {},
      FAILED: (error) => error
    }
  }
});