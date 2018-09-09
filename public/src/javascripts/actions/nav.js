/* /public/src/javascript/actions/nav.js */


export const INPUT = 'INPUT';
export const RESET_INPUT = 'RESET_INPUT';

export const input = (name) => {
  return typeof name !== 'string'
  ? {
    type: RESET_INPUT,
    name
  }
  : {
    type: INPUT,
    name
  };
}