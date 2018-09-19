/* /public/src/crawler/crawler.js */
const http = require('http');
const { URL } = require('url');
const { JSDOM } = require('jsdom');
const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs');
const log4js = require('log4js');

// Log configuration.

log4js.configure({
  appenders: {
    crawler: { type: 'file', filename: path.resolve(__dirname, 'crawler.log') }
  },
  categories: {
    default: { appenders: ['crawler'], level: 'info' }
  }
});

const logger = log4js.getLogger('crawler');

/**
 * 1. Get raw html.
 * 2. Find the target elements and construct an object(entity) from them.
 * 3. Download remote source (e.g. images) and replace the remote url to local one.
 * 4. Export the object to html file.
 */



class Machine {
  constructor(options, loggers) {
    this.options = {
      extractOptions: {},
      entry: '',
      rules: (extract) => {},
      purity: (entity) => {},
      deriveImageMap: (entity) => {},
      deriveLoadPath: (entity) => {},
      log: (level, msg) => {},
    }
    Object.assign(this.options, options);
    // bind this.
    this.extract = this.extract.bind(this);
    this.connect = this.connect.bind(this);
    this.run = this.run.bind(this);
    this.handleImages = this.handleImages.bind(this);
    this.loadHtml = this.loadHtml.bind(this);
  }

  /**
   * run the machine.
   */
  run() {
    const { log, rules, entry } = this.options;
    log('info', '------------------------------------------');
    log('info', 'MISSION START');
    log('info', `ENTRY ${entry}`);
    Promise.resolve(rules(entry)(this.connect)).then(
      log('info', 'MISSION FINISHED')
    );
  }

  /**
   * Extract target elements.
   * @param {*} url 
   * @param {*} options 
   */
  extract(url, options) {
    return new Promise((resolve, reject) => {
      JSDOM.fromURL(url).then((dom) => {
        const doc = dom.window.document;
        const find = (s) => doc.querySelector(s);
        const result = Object.create(null);
        result['url'] = url;
        for (let key of Object.keys(options)) {
          result[key] = find(options[key]);
        }
        resolve(result);
      });
    });
  }

  /**
   * Main process.
   * @param {*} url 
   */
  connect(url) {
    const { log, extractOptions } = this.options;
    log('info', `CURRENT TARGET ${url}`);
    this.extract(url, extractOptions).then((entity) => {
      this.handleImages(entity).then(() => {
        log('info', `IMAGES DOWNLOADED ${url}`);
      }).then(() => {
        this.loadHtml(entity);
      }).then(() => {
        log('info', `HTML DOWNLOADED ${url}`);
        log('info', `TARGET FINISHED ${url}`);
      });
    })
  }

  /**
   * Write the target elements to html.
   * @param {*} entity 
   */
  loadHtml(entity) {
    const { log, deriveLoadPath, purity } = this.options;
    const savepath = deriveLoadPath(entity);
    const dir = path.dirname(savepath);
    if (!fs.existsSync(dir)) mkdirs(dir);
    fs.writeFile(savepath, yaml.safeDump(purity(entity)), 'utf-8', (error) => {
      if (error) log('error',  `WRITEFILE ${url}`);
    });
  }

  /**
   * Download image refered in the html to specified location,
   * change the url to local one. 
   * @param {*} entity 
   */
  handleImages(entity) {
    
    const { log, deriveImageMap } = this.options;
    
    // loadImages
    const loadImages = (url) => new Promise((resolve, reject) => {
      http.get(new URL(url), (res) => {
        let source = '';
        if (res.statusCode !== 200) { log('error', `LOADIMAGES ${url}`) }
        res.setEncoding('binary');
        res.on('data', (chunk) => {
          source += chunk;
        });
        res.on('end', () => {
          resolve(source);
        })
      });
    });

    // handleImages
    const map = deriveImageMap(entity);
    let sequence = Promise.resolve();
    const images = entity.content.querySelectorAll('img');
    Array.prototype.map.call(images, (image) => {
      const [url, savepath, src] = map.get(image.src);
      sequence = sequence.then(() => {
        const dir = path.dirname(savepath);
        if (!fs.existsSync(dir)) mkdirs(dir);
        loadImages(url).then((result) => {
          fs.writeFile(savepath, result, 'binary', (error) => {
            if (error) log('error', `WRITEIMAGE ${url}`);
          });
        });
      });
      removeAllAttributes(image).src = src;
      return image;
    });
    
    return sequence;
  }

}


const m = new Machine({
  extractOptions: {
    title: '.entrytitle',
    author: '.author',
    content: '.entrybody',
    date: '.entrybottom',
  },
  entry: 'http://blog.nogizaka46.com/mai.shiraishi/?d=201808',
  rules: (entry) => (connect) => {
    const next = (entry) =>{
      JSDOM.fromURL(entry).then((dom) => {
        const aa = dom.window.document.querySelector('#daytable').querySelectorAll('a');
        Array.prototype.forEach.call(aa, (a) => {
          connect(a.href);
        });
        const n = dom.window.document.querySelector('.next');
        if (null !== n)
          next(n.href);
      });
    };
    setTimeout(() => next(entry), 5000 * (1 + Math.random()));
  },
  purity: (entity) => {
    const dateText = entity.date.textContent.slice(0, 16);
    const pureEntity = Object.create(null);
    const meta = entity.content.querySelector('meta');
    if (!!meta) {
      entity.content.removeChild(meta);
    }
    pureEntity.url = entity.title.children[0].href;
    pureEntity.title = entity.title.children[0].textContent;
    pureEntity.date = dateText;
    pureEntity.author = entity.author.textContent;
    pureEntity.content = entity.content.innerHTML;
    return pureEntity;
  },
  deriveImageMap: (entity) => {
    const hostname = '';
    const map = new Map();
    const aa = entity.content.querySelectorAll('a');
    if (aa.length !== 0) {
      Array.prototype.forEach.call(aa, (a) => {
        a.replaceWith(a.children[0]);
      })
    }
    const images = entity.content.querySelectorAll('img');
    const date = new Date(entity.date.textContent.slice(0, 16));
    const name = /[a-z.]+(?=\/\?d)/.exec(entity.url)[0];
    const generateRandomStr = () => Math.random().toString(36).slice(2, 10);
    //const _303 = 'http://blog.nogizaka46.com/' + src.slice(31, src.length);
    for (let image of images) {
      const savepath = `images/blog/${name}/${format(date, 'yyyy/MM/dd')}/${generateRandomStr()}.jpg`;
      const src = image.src;
      map.set(src, [
        src,
        path.resolve(foldback(path.resolve(__dirname), 2), savepath),
        `${hostname}/${savepath}`
      ]);
    }
    return map;
  },
  deriveLoadPath: (entity) => {
    const id = /\d+(?=\.php)/.exec(entity.title.children[0].href)[0];
    const date = new Date(entity.date.textContent.slice(0, 16));
    const name = /[a-z.]+(?=\/\?d)/.exec(entity.url)[0];
    const savepath = `views/blog/${name}/${format(date, 'yyyy/MM/dd')}${id}.yaml`;
    return path.resolve(foldback(path.resolve(__dirname), 2), savepath);
  },
  log: (level, msg) => {
    logger[level](msg);
  }
});

//m.connect('http://blog.nogizaka46.com/renka.iwamoto/?d=20180222');
m.run();


/*
const m2 = () => {
  const map = Function.prototype.call.bind(Array.prototype.map);
  JSDOM.fromURL('http://www.nogizaka46.com/member/').then((dom) => {
    const doc = dom.window.document;
    const units = map(doc.querySelectorAll('.unit'), (e) => {
      const name = e.querySelector('.main').textContent;
      const hiragana = (e.querySelector('.sub') || e.querySelector('.sub2')).textContent;
      return {
        link: e.firstChild.href,
        info: { name, hiragana }
      };
    });
    return units;
  }).then((units) => {
    return map(units, (unit) => {
      return JSDOM.fromURL(unit.link).then((dom) => {
        const doc = dom.window.document;
        const profile = doc.querySelector('#profile');
        const info = profile.querySelectorAll('dd');
        return {
          image: profile.querySelector('img').src,
          info: Object.assign(unit.info, {
            birthdate: info[0].textContent,
            abo: info[1].textContent,
            constellation: info[2].textContent,
            stature: info[3].textContent,
          })
        };
      })
    })
  }).then((profiles) =>{
    profiles.forEach((profile) => {
      profile.then((p) => {
        // download image
        console.log(p.info.name);
        const name = matches(p.info.name)[0].info.roma.replace(/\s/,'_');
        
        new Promise((resolve, reject) => {
          http.get(new URL(p.image), (res) => {
            let source = '';
            if (res.statusCode !== 200) { console.log(p.image) }
            res.setEncoding('binary');
            res.on('data', (chunk) => {
              source += chunk;
            });
            res.on('end', () => {
              resolve(source);
            })
          });
        }).then((result) => {
          const savepath = path.resolve(foldback(__dirname, 2), 'images/member/');
          if (!fs.existsSync(savepath)) mkdirs(savepath);
          fs.writeFile(path.resolve(savepath, `${name}.jpg`), result, 'binary', (error) => {
            if (error) console.log(error)
          });
        });
        new Promise((resolve, reject) => {
          const savepath = path.resolve(foldback(__dirname, 2), 'views/profile/');
          if (!fs.existsSync(savepath)) mkdirs(savepath);
          fs.writeFile(path.resolve(savepath, `${name}.yaml`), yaml.safeDump(p.info), 'utf-8', (error) => {
            if (error) console.log(error);
          });
        })

      })
    })
  })
}

m2();
*/


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

