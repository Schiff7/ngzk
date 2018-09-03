/* /public/src/javascript/actions/nav.js */


export const SUBMIT = 'SUBMIT';

export const submit = (name) => {
  return {
    type: SUBMIT,
    name
  };
}

export const INPUT = 'INPUT';
export const RESET_INPUT = 'RESET_INPUT';

export const input = (name) => {

  return name === ''
  ? {
    type: RESET_INPUT,
    name
  }
  : {
    type: INPUT,
    name
  };
}