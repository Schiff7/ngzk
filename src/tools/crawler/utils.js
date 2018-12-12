// utils.
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
// ------------------------- UTILS

class Utils {
  constructor() {}
  /**
   * Date format.
   * @param {*} date 
   * @param {*} format 
   */
  static format(date, format) {
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

  /**
   * Make directory recursively.
   * @param {*} dirpath 
   */
  static mkdirs(dirpath) {
    if (!fs.existsSync(path.dirname(dirpath)))
      this.mkdirs(path.dirname(dirpath));
    fs.mkdirSync(dirpath);
  }

  /**
   * 
   * @param {*} dirpath 
   */
  static rmdirs(dirpath) {
    if (!fs.existsSync(dirpath))
      throw new Error(`${dirpath} does not exist.`);
    if (fs.statSync(dirpath).isDirectory()) {
      const dirs = fs.readdirSync(dirpath);
      dirs.forEach(dir => {
        this.rmdirs(path.resolve(dirpath, dir));
      });
      fs.rmdirSync(dirpath);
    } else {
      fs.unlinkSync(dirpath);
    }
  }

  /**
   * Reset attributes of an element.
   * @param {*} element 
   */
  static resetAttributes(element, newAttrs) {
    element.getAttributeNames().forEach((attr) => {
      element.removeAttribute(attr);
    });
    Object.keys(newAttrs).forEach((key) => {
      element[key] = newAttrs[key];
    })
    return element;
  }

  /**
   * Foldback to parent path.
   * @param {*} p 
   * @param {*} level 
   */
  static foldback(p, level) {
    if (level === 0)
      return path.resolve(p);
    return this.foldback(path.dirname(p), level - 1);
  }


  /**
   * 
   * @param {*} func the function you want to reexecute when faild ( need to throw a exception ). 
   * @param {*} error_callback will execute when retry times reach the specified max times. 
   * @param {*} max_times ...
   */
  static async retry (func, error_callback, max_times) {
    let result = null;
    let i = 0;
    while(true) {
      try {
        result = await Promise.race([func(), new Promise((_, reject) => {
          setTimeout(() => { 
            i++;
            reject(new Error('timeout'));
          }, 10000);
        })]);
        break; 
      } catch (error) {
        // ...
        if ( environment === 'DEV' ) console.log('\t\trequested error, will try again 5s later.')
        if ( ( error_callback && max_times ) && !(i < max_times) ) { 
          error_callback();
        }
        await this.sleep(5000);
      }
    }
    return result;
  }

  /**
   * 
   * @param {*} type 
   * @param {*} payload 
   */
  static action(type, payload) {
    return JSON.stringify({ type, payload });
  }

  /**
   * 
   * @param {*} ms 
   */
  static sleep(ms) {
    return new Promise((resolve, _) => {
      setTimeout(resolve, ms, 'done');
    });
  }

  /**
   * ...
   * @param {*} executors 
   */
  static async all(executors, ms) {
    const results = [];
    for (let executor of executors) {
      if (ms) await this.sleep(ms);
      const result = await executor();
      results.push(result);
    }
    return results;
  }

  /**
   * 
   * @param {*} dirpath 
   */
  static read(dirpath) {
    if (!fs.existsSync(dirpath))
      throw new Error(`${dirpath} does not exist.`);
    const eles = {};
    if (fs.statSync(dirpath).isDirectory()) {
      const dirs = fs.readdirSync(dirpath);
      dirs.forEach(dir => {
        const fullPath = path.resolve(dirpath, dir);
        if (fs.statSync(fullPath).isDirectory()) {
          eles[dir] = this.read(fullPath);
        } else {
          if (/\.(yml|yaml)$/.test(dir)) {
            const doc = yaml.safeLoad(fs.readFileSync(fullPath, 'utf8'));
            eles[dir.replace(/\.(yml|yaml)$/, '')] = doc.title; 
          }
        }
      });
    } else {
      return path.basename(dirpath);
    }
    return eles;
  }
}

module.exports = Utils;