/* /src/javascript/utils/format.js */


// ------------------------- UTILS

/**
 * Date format.
 * @param {*} date 
 * @param {*} format 
 */
function format(date, format) {
  const t = {
    "y": date.getFullYear(),
    "M": date.getMonth() + 1,
    "d": date.getDate(),
    "H": date.getHours(),
    "m": date.getMinutes(),
    "s": date.getSeconds(),
    "S": date.getMilliseconds(),
  };
  
  /**
   * e.g.
   * f('7', 2) == '07', f('7', 3) == '007'.
   * f('1998', 2) == '98'
   * @param {*} s string
   * @param {*} l length
   */
  function f(s, l) {
    s = s.length <= l
      ? '0'.repeat(l).slice(0, l - s.length) + s
      : s.slice(s.length - l, s.length);
    return s;
  }

  for(let k of Object.keys(t)) {
    if (new RegExp(`(${k}+)`).test(format))
      format = format.replace(RegExp.$1, f(t[k] + '', RegExp.$1.length));
  }

  return format;

}

export default format;