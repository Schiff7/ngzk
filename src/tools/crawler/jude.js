/* /src/tools/crawler/jude.js */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const yaml = require('js-yaml');
const log4js = require('log4js');
const { JSDOM } = require('jsdom');

// Log configuration.

log4js.configure({
  appenders: {
    jude: { type: 'file', filename: path.resolve(__dirname, 'jude.log') }
  },
  categories: {
    default: { appenders: ['jude'], level: 'info' }
  }
});

const logger = log4js.getLogger('jude');

const log = (level, msg) => logger[level](msg);


// ----------------------------- BLOG CRAWLER

// Predefine.


// reusable.
class Machine {
  constructor() {}

  static async extract(url, options) {
    const dom = await JSDOM.fromURL(url);
    const doc = dom.window.document;
    const find = (e) => doc.querySelector(e);
    const result = Object.create(null);
    for (let key of Object.keys(options)) {
      result[key] = find(options[key]);
    }
    result['url'] = url;
    return result;
  }

  static async writeImage(url, path) {
    try {
      const response = await axios(url, {method: 'get', responseType: 'stream', timeout: 2000 });
      response.data.pipe(fs.createWriteStream(path));
    } catch (error) {
      log('error', JSON.stringify({ url, path }));
    }
  }
}

// Dirty
const Dirty = {
  options: {
    title: '.entrytitle',
    author: '.author',
    content: '.entrybody',
    date: '.entrybottom',
  },
  derivePath: (o) => {
    const id = o.title.firstChild.href.search(/\d+(?=\.php)/);
    const date = new Date(o.date.textContent.slice(0, 16));
    const name = /[a-z.]+(?=\/\?d)/.exec(o.url)[0];
    const savepath = `views/blog/${name}/${format(date, 'yyyy/MM/dd')}${id}.yaml`;
    return path.resolve(foldback(__dirname, 2), savepath);
  },
  deriveMap: (o) => {
    const hostname = '';
    const map = new Map();
    const links = o.content.querySelectorAll('a');
    if (links.length !== 0) {
      [...links].forEach((link) => {
        link.replaceWith(link.firstChild);
      })
    }
    const images = o.content.querySelectorAll('img');
    const date = new Date(o.date.textContent.slice(0, 16));
    const name = /[a-z.]+(?=\/\?d)/.exec(o.url)[0];
    const randomStr = () => Math.random().toString(36).slice(2, 10);
    for (let image of images) {
      const savepath = `images/blog/${name}/${format(date, 'yyyy/MM/dd')}/${randomStr()}.jpg`;
      const src = image.src;
      map.set(src, [
        src,
        path.resolve(foldback(__dirname, 2), savepath),
        `${hostname}/${savepath}`
      ]);
    }
    return map;
  },
  rules: (entry) => (connect) => {
    const next = async (entry) =>{
      try {
        const dom = await JSDOM.fromURL(entry);
        const doc = dom.window.document;
        const links = doc.querySelector('#daytable').querySelectorAll('a');
        [...links].forEach((link) => {
          connect(link.href);
        });
        const n = doc.querySelector('.next');
        if (!!n) { 
          next(n.href);
        } else {
          log('info', 'MISSION FINISHED');
          log('info', '----------------------------------------------------------------------------');
        }
      } catch (error) {
        log('error', error);
      }
    };
    next(entry);
  },
  purity: (o) => {
    const date = o.date.textContent.slice(0, 16);
    const meta = o.content.querySelector('meta');
    if (!!meta) {
      o.content.removeChild(meta.parentNode === o.content ? meta : meta.parentNode);
    }
    return {
      url: o.title.firstChild.href,
      title: o.title.firstChild.textContent,
      date: date,
      author: o.author.textContent,
      content: o.content.innerHTML
    };
  },

}

const run = (entry) => {
  log('info', '----------------------------------------------------------------------------');
  log('info', 'MISSION START');
  log('info', `ENTRY ${entry}`);
  const connect = async (url) => {
    log('info', `CURRENT TARGET ${url}`);
    const o = await Machine.extract(url, Dirty.options);
    const map = Dirty.deriveMap(o);
    const images = o.content.querySelectorAll('img');
    if (!!images[0]) {
      const dir = path.dirname(map.get(images[0].src)[1]);
      if (fs.existsSync(dir)) rmdirs(dir);
      if (!fs.existsSync(dir)) mkdirs(dir);
    }
    [...images].forEach((image) => {
      const [url, savepath, src] = map.get(image.src);
      Machine.writeImage(url, savepath).then(() => {
        log('info', `IMAGES DOWNLOADED ${url}`);
      });
      removeAllAttributes(image).src = src;
    });
    const savepath = Dirty.derivePath(o);
    const dir = path.dirname(savepath);
    if (!fs.existsSync(dir)) mkdirs(dir);
    new Promise((resolve, reject) => {
      fs.writeFile(savepath, yaml.safeDump(Dirty.purity(o)), 'utf-8', (error) => {
        if (error) reject(error);
        log('info', `HTML DOWNLOADED ${url}`);
        log('info', `TARGET FINISHED ${url}`);
      });
      resolve();
    }).catch((error) => {
      log('error',  `WRITEFILE ${url}`);
      log('error', error);
    });
    
  }
  Dirty.rules(entry)(connect);
}

run('http://blog.nogizaka46.com/rena.yamazaki/?d=201602');

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

/**
 * Make directory recursively.
 * @param {*} dirpath 
 */
function mkdirs(dirpath) {
  if (!fs.existsSync(path.dirname(dirpath)))
    mkdirs(path.dirname(dirpath));
  fs.mkdirSync(dirpath);
}

function rmdirs(dirpath) {
  if (!fs.existsSync(dirpath))
    throw error(`${dirpath} does not exist.`)
  if (fs.statSync(dirpath).isDirectory()) {
    const dirs = fs.readdirSync(dirpath);
    dirs.forEach(dir => {
      rmdirs(path.resolve(dirpath, dir));
    });
    fs.rmdirSync(dirpath);
  } else {
    fs.unlinkSync(dirpath);
  }
}

/**
 * Remove all attributes of an element.
 * @param {*} element 
 */
function removeAllAttributes(element) {
  element.getAttributeNames().forEach((attr) => {
    element.removeAttribute(attr);
  });
  return element;
}

/**
 * Foldback to parent path.
 * @param {*} p 
 * @param {*} level 
 */
function foldback(p, level) {
  if (level === 0)
    return path.resolve(p);
  return foldback(path.dirname(p), level - 1);
}

function read(dirpath) {
  if (!fs.existsSync(dirpath))
    throw error(`${dirpath} does not exist.`)
  const o = Object.create(null);
  if (fs.statSync(dirpath).isDirectory()) {
    const dirs = fs.readdirSync(dirpath);
    dirs.forEach(dir => {
      const fullPath = path.resolve(dirpath, dir);
      if (fs.statSync(fullPath).isDirectory()) {
        o[dir] = read(fullPath);
      } else {
        o[dir] = dir
      }
    });
  } else {
    return path.basename(dirpath);
  }
  return o;
}

/*
fs.writeFile(`${foldback(__dirname, 2)}/views/contents/renka.iwamoto.yaml`, yaml.safeDump(read(`${foldback(__dirname, 2)}/views/blog/renka.iwamoto`)), 'utf-8', (error) => {
  if (error) console.error(error);
});
*/