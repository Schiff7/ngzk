const fs = require('fs');
const path = require('path');
const axios = require('axios');
const yaml = require('js-yaml');
const log4js = require('log4js');
const { JSDOM } = require('jsdom');

// Log configuration.
log4js.configure({
  appenders: {
    jinx: { type: 'file', filename: path.resolve(__dirname, 'jinx.log') }
  },
  categories: {
    default: { appenders: ['jinx'], level: 'info' }
  }
});

const logger = log4js.getLogger('jinx');


// --------------------------- CRAWLER

class Machine {
  constructor(conf) {
    this.conf = {
      options: {},
      entry: undefined,
      rules: undefined,
      purity: undefined,
      deriveImageMap: undefined,
      deriveLoadPath: undefined,
      log: undefined,
    }
    Object.assign(this.conf, conf);
  }

  // ...
  async retry (func, info, times) {
    const { log } = this.conf;
    let result = null;
    for ( let i = 0; i < times; i++ ) {
      try {
        result = await func();
        break; 
      } catch (error) {
        if (i === times - 1) {
          // handle exception.
          // log('error', error);
          log('error', info);
        }
      }

    }
    return result;
  }

  // ...
  all(executors) {
    const promises = executors.map(executor => executor());
    return Promise.all(promises);
  }

  // ...
  action(type, payload) {
    return JSON.stringify({ type, payload });
  }

  // ...
  run() {
    const { entry, rules } = this.conf;
    rules(entry)(this.connect);
  }

  // ...
  async connect(url) {
    const { options, purity, deriveLoadPath, deriveImageMap, log } = this.conf;
    // extract
    const o = await this.extract(url, options);
    // handle images
    const records = await this.handleImages(o, deriveImageMap);
    log('info', records);
    // handle blog
    const savepath = deriveLoadPath(o);
    const dir = path.dirname(savepath);
    if (!fs.existsSync(dir)) mkdirs(dir);
    const writable = fs.createWriteStream(savepath);
    // ...
    const feedback = await new Promise((resolve, reject) => {
      writable.write(purity(o), 'utf-8', (error) => {
        if (error) reject(error);
      });
      resolve(this.action('write', { url }));
    }).then(
      (i) => {
        return i;
      },
      (error) => {
        // log('error', error);
        log('error', this.action('write', { url }));
      }
    );
    log('info', feedback);
    // ...
  }


  async extract(url, options) {
    const response = await this.retry(
      () => axios(url, { method: 'get', responseEncoding: 'utf8', timeout: 3000 }),
      this.action('extract', { url }), 3);
    const doc = JSDOM.fragment(response.data);
    const result = { url };
    for (let key of Object.keys(options)) {
      result[key] = doc.querySelector(options[key]);
    }
    return result;
  }

  async writeImage(url, path) {
    const response = await this.retry(
      () => axios(url, {method: 'get', responseType: 'stream', timeout: 3000 }),
      this.action('image', { url, path }), 3);
    // ...
    response.data.pipe(fs.createWriteStream(path));
    return this.action('image', { url, path });
  }

  async handleImages(o, deriveImageMap) {
    // get images map.
    const map = deriveImageMap(o);
    // mkdir
    const images = o.content.querySelectorAll('img');
    if (!!images[0]) {
      const dir = path.dirname(map.get(images[0].src)[1]);
      if (fs.existsSync(dir)) rmdirs(dir);
      if (!fs.existsSync(dir)) mkdirs(dir);
    }
    // ...
    const requests = [];
    [...images].forEach((image) => {
      const [url, savepath, src] = map.get(image.src);
      const request = () => this.writeImage(url, savepath);
      requests.push(request);
      resetAttributes(image, { src });
    });
    const records = await this.all(requests);
    return records;
  }
}

const m = new Machine({
  entry: '',
  options: {
    title: '.entrytitle',
    author: '.author',
    content: '.entrybody',
    date: '.entrybottom',
  },
  rules: (entry) => (connect) => {
    const next = async (entry) =>{
      try {
        const response = await axios(entry, { method: 'get', responseEncoding: 'utf8', timeout: 3000 });
        const doc = JSDOM.fragment(response.data);
        const links = doc.querySelector('#daytable').querySelectorAll('a');
        const connects = [...links].map((link) => connect(link.href));
        Promise.all(connects).then(() => {
          const n = doc.querySelector('.next');
          if (!!n) next(n.href);
        });
      } catch (error) {
        //...
      }
    };
    next(entry);
  },
  deriveLoadPath: (o) => {
    const id = o.title.firstChild.href.search(/\d+(?=\.php)/);
    const date = new Date(o.date.textContent.slice(0, 16));
    const name = /[a-z.]+(?=\/\?d)/.exec(o.url)[0];
    const savepath = `views/blog/${name}/${format(date, 'yyyy/MM/dd')}${id}.yaml`;
    return path.resolve(foldback(__dirname, 2), savepath);
  },
  deriveImageMap: (o) => {
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
  purity: (o) => {
    const date = o.date.textContent.slice(0, 16);
    const meta = o.content.querySelector('meta');
    if (!!meta) {
      o.content.removeChild(meta.parentNode === o.content ? meta : meta.parentNode);
    }
    return yaml.dump({
      url: o.title.firstChild.href,
      title: o.title.firstChild.textContent,
      date: date,
      author: o.author.textContent,
      content: o.content.innerHTML
    });
  },
  log: (level, msg) => logger[level](msg),
});

m.connect('http://blog.nogizaka46.com/rena.yamazaki/?d=20160205');


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
 * Reset attributes of an element.
 * @param {*} element 
 */
function resetAttributes(element, newAttrs) {
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
function foldback(p, level) {
  if (level === 0)
    return path.resolve(p);
  return foldback(path.dirname(p), level - 1);
}