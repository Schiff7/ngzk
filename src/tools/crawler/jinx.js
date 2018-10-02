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

const log = (level, msg) => logger[level](msg);


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
      Utils.mkdirs(path.dirname(dirpath));
    fs.mkdirSync(dirpath);
  }

  /**
   * 
   * @param {*} dirpath 
   */
  static rmdirs(dirpath) {
    if (!fs.existsSync(dirpath))
      throw error(`${dirpath} does not exist.`)
    if (fs.statSync(dirpath).isDirectory()) {
      const dirs = fs.readdirSync(dirpath);
      dirs.forEach(dir => {
        Utils.rmdirs(path.resolve(dirpath, dir));
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
    return Utils.foldback(path.dirname(p), level - 1);
  }


  /**
   * 
   * @param {*} func 
   * @param {*} info 
   * @param {*} times 
   */
  static async retry (func, info, times) {
    let result = null;
    for ( let i = 0; i < times; i++ ) {
      try {
        result = await func();
        break; 
      } catch (error) {}

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
  static delay(ms) {
    return new Promise((resolve, _) => {
      setTimeout(resolve, ms, 'done');
    });
  }

  /**
   * ...
   * @param {*} executors 
   */
  static async all(executors, ms) {
    // const promises = executors.map(executor => executor());
    // return Promise.all(promises);
    const results = [];
    for (let executor of executors) {
      if (ms) await Utils.delay(ms);
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
      console.log(`${dirpath} does not exist.`);
    const o = Object.create(null);
    if (fs.statSync(dirpath).isDirectory()) {
      const dirs = fs.readdirSync(dirpath);
      dirs.forEach(dir => {
        const fullPath = path.resolve(dirpath, dir);
        if (fs.statSync(fullPath).isDirectory()) {
          o[dir] = Utils.read(fullPath);
        } else {
            const doc = yaml.safeLoad(fs.readFileSync(fullPath, 'utf8'));
            o[dir] = doc.title; 
        }
      });
    } else {
      return path.basename(dirpath);
    }
    return o;
  }


}



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
    }
    this.record = {};
    Object.assign(this.conf, conf);
    // bind this.
    this.extract = this.extract.bind(this);
    this.connect = this.connect.bind(this);
    this.run = this.run.bind(this);
    this.handleImages = this.handleImages.bind(this);
  }



  /**
   * run the machine.
   */
  run() {
    const { entry, rules } = this.conf;
    rules(entry)(this.connect);
  }

  /**
   * main.
   * @param {*} url 
   */
  async connect(url) {
    const { options, purity, deriveLoadPath, deriveImageMap } = this.conf;
    // extract
    console.log(`\t connect ${url}.`);
    const o = await this.extract(url, options);
    console.log('\t\t extracted.');
    // handle images
    const records = await this.handleImages(o, deriveImageMap);
    console.log('\t\t images handled.');
    log('info', records);
    // handle blog
    const savepath = deriveLoadPath(o);
    const dir = path.dirname(savepath);
    if (!fs.existsSync(dir)) Utils.mkdirs(dir);
    // ...
    const feedback = await new Promise((resolve, reject) => {
      const writable = fs.createWriteStream(savepath);
      writable.write(purity(o), 'utf-8', (error) => {
        if (error) reject(error);
      });
      resolve(Utils.action('view', { url }));
    }).then(
      (i) => i,
      (error) => {
        // log('error', error);
        log('error', Utils.action('write_view', { url }));
      }
    );
    console.log('\t\t wrote.');
    log('info', feedback);
    // ...
    return Utils.action('connect', { url })
  }

  /**
   * extract specified elements from a page.
   * @param {*} url 
   * @param {*} options 
   */
  async extract(url, options) {
    const response = await Utils.retry(
      () => axios(url, { method: 'get', responseEncoding: 'utf8', timeout: 5000 }),
      () => log('error', Utils.action('extract', { url })), 3);
    const doc = JSDOM.fragment(response.data);
    const result = { url };
    for (let key of Object.keys(options)) {
      result[key] = doc.querySelector(options[key]);
    }
    return result;
  }

  /**
   * write image.
   * @param {*} url 
   * @param {*} path 
   */
  async writeImage(url, path) {
    // const response = await Utils.retry(
    //   () => axios(url, {method: 'get', responseType: 'stream', timeout: 5000 }),
    //   () => log('error', Utils.action('image', { url, path })), 3);
    const response = await axios(url, {method: 'get', responseType: 'stream', timeout: 5000 });
    // ...
    const feedback = await new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(path), (error) => {
        if (error) reject(error);
      });
      resolve(Utils.action('image', { url, path }));
    }).then(
      (i) => i,
      (error) => {
        // log('error', error);
        log('error', Utils.action('write_image', { url }));
      }
    )
    
    return feedback;
  }

  /**
   * handle the images in the extracted content.
   * @param {*} o 
   * @param {*} deriveImageMap 
   */
  async handleImages(o, deriveImageMap) {
    // get images map.
    const map = deriveImageMap(o);
    // mkdir
    const images = o.content.querySelectorAll('img');
    if (!!images[0]) {
      const [ _, any, __ ] = map.get(images[0].src);
      const dir = path.dirname(any);
      if (fs.existsSync(dir)) Utils.rmdirs(dir);
      if (!fs.existsSync(dir)) Utils.mkdirs(dir);
    }
    // ...
    const requests = [];
    [...images].forEach((image) => {
      const [url, savepath, src] = map.get(image.src);
      const request = () => this.writeImage(url, savepath);
      requests.push(request);
      Utils.resetAttributes(image, { src });
    });
    const records = await Utils.all(requests, 1500);
    return records;
  }
}

const m = new Machine({
  entry: 'http://blog.nogizaka46.com/yumi.wakatsuki/?d=201111',
  options: {
    title: '.entrytitle',
    author: '.author',
    content: '.entrybody',
    date: '.entrybottom',
  },
  rules: (entry) => async (connect) => {
    const next = async (entry) =>{
      // const response = await Utils.retry(
      //   () => axios(entry, { method: 'get', responseEncoding: 'utf8', timeout: 5000 }),
      //   () => log('error', Utils.action('next', { entry })), 3);
      const response = await axios(entry, { method: 'get', responseEncoding: 'utf8', timeout: 5000 });
      const doc = JSDOM.fragment(response.data);
      const links = doc.querySelector('#daytable').querySelectorAll('a');
      const connects = [...links].map((link) => () => connect(link.href));
      const feedback = await Utils.all(connects, 1500);
      const n = doc.querySelector('.next');
      // if (!!n) next(n.href);
      if (!!n) return n;
    };
    let k = entry;
    while(k) {
      console.log(`next ${k}`);
      try {
        k = await next(k);
      } catch (error) {
        // ...
      }
    }
  },
  deriveLoadPath: (o) => {
    const id = o.title.firstChild.href.search(/\d+(?=\.php)/);
    const date = new Date(o.date.textContent.slice(0, 16));
    const name = /[a-z.]+(?=\/\?d)/.exec(o.url)[0];
    const savepath = `views/blog/${name}/${Utils.format(date, 'yyyy/MM/dd')}${id}.yaml`;
    return path.resolve(Utils.foldback(__dirname, 2), savepath);
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
      const savepath = `images/blog/${name}/${Utils.format(date, 'yyyy/MM/dd')}/${randomStr()}.jpg`;
      const src = image.src;
      map.set(src, [
        src,
        path.resolve(Utils.foldback(__dirname, 2), savepath),
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
  }
});

m.run();