/* /public/src/javascript/actions/nav.js */


export const INPUT = 'INPUT';
export const RESET_INPUT = 'RESET_INPUT';

export const input = (name) => {
  return typeof name !== 'string'
  ? {
    type: RESET_INPUT,
  }
  : {
    type: INPUT,
    name
  };
}

export const ENABLE_BLUR = 'ENABLE_BLUR';
export const DISABLE_BLUR = 'DISABLE_BLUR';

export const blur = (bool) => {
  return {
    type: bool ? ENABLE_BLUR : DISABLE_BLUR,
  };
}

export const CACHE_INPUT = 'CACHE_INPUT';
export const CLEAR_CACHE = 'CLEAR_CACHE';

export const cacheInput = (name) => {
  return {
    type: CACHE_INPUT,
    name
  };
}

export const clearCache = () => {
  return {
    type: CLEAR_CACHE
  };
}