/* /public/src/javascript/actions/box.js */

export const SHOW_OPTIONS = 'SHOW_OPTIONS';
export const HIDE_OPTIONS = 'HIDE_OPTIONS';
export const TOGGLE_OPTIONS = 'TOGGLE_OPTIONS';

export const showOptions = () => {
  return {
    type: SHOW_OPTIONS
  }
}

export const hideOptions = () => {
  return {
    type: HIDE_OPTIONS
  }
}

export const toggleOptions = () => {
  return {
    type: TOGGLE_OPTIONS
  }
}

export const BOX_ENABLE_BLUR = 'BOX_ENABLE_BLUR';
export const BOX_DISABLE_BLUR = 'BOX_DISABLE_BLUR';

export const blur = (bool) => {
  return {
    type: bool ? BOX_ENABLE_BLUR : BOX_DISABLE_BLUR
  }
}

export const SELECT = 'SELECT';

export const select = (value) => {
  return {
    type: SELECT,
    value
  }
}