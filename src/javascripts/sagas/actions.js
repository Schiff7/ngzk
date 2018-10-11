// /src/javascripts/sagas/actions.js
import { createActions } from 'redux-actions';

export const impureActions = createActions({
  FETCH: {
    PROF: {
      REQUESTED: (name) => ({ name }),
      SUCCEEDED: (prof) => ({ prof }),
      FAILED: (error) => error
    },
    ARTICLE: {
      REQUESTED: (location) => ({ location }),
      SUCCEEDED: (article) => ({ article }),
      FAILED: (error) => error
    },
    CONTENTS: {
      REQUESTED: (name) => ({ name }),
      SUCCEEDED: (contents) => ({ contents }),
      FAILED: (error) => error
    }
  }
});