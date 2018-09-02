/* /public/src/javascript/actions/nav.js */


export const NAV_TOP = 'NAV_TOP';
export const NAV_LEFT = 'NAV_LEFT';
export const NAV_HIDE = 'NAV_HIDE';


export const navTop = (h) => ({
  type: NAV_TOP,
  h
})

export const navLeft = (h) => ({
  type: NAV_LEFT,
  h
})

export const navHide = (h) => ({
  type: NAV_HIDE,
  h
})