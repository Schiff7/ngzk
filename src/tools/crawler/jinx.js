const fs = require('fs');
const path = require('path');
const axios = require('axios');
const yaml = require('js-yaml');
const log4js = require('log4js');
const { JSDOM } = require('jsdom');
// Log configuration.
log4js.configure({
  appenders: {
    all: { type: 'file', filename: 'jinx.log' },
    error: { type: 'file', filename: 'jinx_error.log' },
    just_error : { type: 'logLevelFilter', appender: 'error', level: 'error' }
  },
  categories: {
    default: { appenders: ['all', 'just_error'], level: 'info' }
  }
});

const logger = log4js.getLogger();

// -------------------------- GLOBAL

const log = (level, msg) => logger[level](msg);
const environment = 'DEV';

if ( environment === 'DEV' ) console.log(environment);

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
      throw error(`${dirpath} does not exist.`)
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
      throw Error(`${dirpath} does not exist.`);
    const eles = Object.create(null);
    if (fs.statSync(dirpath).isDirectory()) {
      const dirs = fs.readdirSync(dirpath);
      dirs.forEach(dir => {
        const fullPath = path.resolve(dirpath, dir);
        if (fs.statSync(fullPath).isDirectory()) {
          eles[dir] = this.read(fullPath);
        } else {
            const doc = yaml.safeLoad(fs.readFileSync(fullPath, 'utf8'));
            eles[dir] = doc.title; 
        }
      });
    } else {
      return path.basename(dirpath);
    }
    return eles;
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
    if ( environment === 'DEV' ) console.log(`\t connect ${url}.`);
    const eles = await this.extract(url, options);
    if ( environment === 'DEV' ) console.log('\t\t extracted.');
    // handle images
    const images = await this.handleImages(eles, deriveImageMap);
    if ( environment === 'DEV' ) console.log('\t\t images handled.');
    // handle blog
    const savepath = deriveLoadPath(eles);
    const dir = path.dirname(savepath);
    if (!fs.existsSync(dir)) Utils.mkdirs(dir);
    // ...
    const views = await new Promise((resolve, reject) => {
      const writable = fs.createWriteStream(savepath);
      writable.write(purity(eles), 'utf-8', (error) => {
        if (error) reject(error);
      });
      resolve(Utils.action('views', { url }));
    }).then(
      (i) => i,
      (error) => {
        // log('error', error);
        log('error', Utils.action('write_view', { url, error }));
      }
    );
    if ( environment === 'DEV' ) console.log('\t\t wrote.');
    // ...
    return Utils.action('connect', { connect: { images, views } });
  }

  /**
   * extract specified elements from a page.
   * @param {*} url 
   * @param {*} options 
   */
  async extract(url, options) {
    const response = await Utils.retry(
      () => axios({ url }), 
      () => { throw new Error(Utils.action('extract', url)) }, 7 );
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
    const response = await Utils.retry(
      () => axios({ url, responseType: 'stream' }),
      () => { throw new Error(Utils.action('request_image', url)) }, 3 );
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
        log('error', Utils.action('write_image', { url, error }));
      }
    )
    
    return feedback;
  }

  /**
   * handle the images in the extracted content.
   * @param {*} eles 
   * @param {*} deriveImageMap 
   */
  async handleImages(eles, deriveImageMap) {
    // get images map.
    const map = deriveImageMap(eles);
    // mkdir
    const images = eles.content.querySelectorAll('img');
    const [ sample, ...rest ] = images;
    if (!!sample) {
      const [ _, any, __ ] = map.get(sample.src);
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
    const records = await Utils.all(requests, 1000);
    return records;
  }
}

const m = new Machine({
  entry: 'http://blog.nogizaka46.com/yuuki.yoda/?d=archives',
  options: {
    title: '.entrytitle',
    author: '.author',
    content: '.entrybody',
    date: '.entrybottom',
  },
  rules: (entry) => async (connect) => {
    const next = async (entry) =>{
      const response = await Utils.retry(() => axios({ url: entry }));
      const doc = JSDOM.fragment(response.data);
      const links = doc.querySelector('#daytable').querySelectorAll('a');
      const connects = [...links].map((link) => () => connect(link.href));
      const feedback = await Utils.all(connects, 100);
      // log('info', feedback);
      return feedback;
    };
    const page = await Utils.retry(() => axios({ url: entry }));
    const archives = [...JSDOM.fragment(page.data).querySelectorAll('.archive-content a')].map(ele => ele.href);
    for (let archive of archives) {
      if ( environment === 'DEV' ) log('info', `next ${archive}`);
      await next(archive);
    }
    return;
  },
  deriveLoadPath: (eles) => {
    const date = new Date(eles.date.textContent.slice(0, 16));
    const name = /[a-z.]+(?=\/\?d)/.exec(eles.url)[0].replace(/\./, '_');
    const savepath = `views/blog/${name}/${Utils.format(date, 'yyyy/MM/dd')}.yml`;
    return path.resolve(Utils.foldback(__dirname, 2), savepath);
  },
  deriveImageMap: (eles) => {
    const hostname = '';
    const map = new Map();
    const links = eles.content.querySelectorAll('a');
    if (links.length !== 0) {
      [...links].forEach((link) => {
        link.replaceWith(link.firstChild);
      })
    }
    const images = eles.content.querySelectorAll('img');
    const date = new Date(eles.date.textContent.slice(0, 16));
    const name = /[a-z.]+(?=\/\?d)/.exec(eles.url)[0].replace(/\./, '_');
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
  purity: (eles) => {
    const date = eles.date.textContent.slice(0, 16);
    const meta = eles.content.querySelector('meta');
    if (!!meta) {
      eles.content.removeChild(meta.parentNode === eles.content ? meta : meta.parentNode);
    }
    return yaml.dump({
      url: eles.title.firstChild.href,
      title: eles.title.firstChild.textContent,
      date: date,
      author: eles.author.textContent,
      content: eles.content.innerHTML
    });
  }
});


m.run();
//m.connect('http://blog.nogizaka46.com/ami.noujo/?d=20130615')

module.exports = Utils;