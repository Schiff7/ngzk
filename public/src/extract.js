/* /public/src/javascripts/utils/extract.js */
const http = require('http');
const { URL } = require('url');
const { JSDOM } = require('jsdom');
const path = require('path');
const fs = require('fs');

/**
 * 1. Get raw html.
 * 2. Find the nodes of title, author, content and date.
 * 3. Download the pictures and replace the remote picture resource urls to local ones.
 * 4. Construct the Blog object.
 */



class Machine {
  constructor(options) {
    this.options = {
      extractOptions: {},
      rules: (extract) => {},
      purity: (entity) => {},
      deriveImageMap: (entity) => {},
      deriveLoadPath: (entity) => {},
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
  run() {}

  /**
   * Extract target nodes.
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
        for (var key of Object.keys(options)) {
          result[key] = find(options[key]);
        }
        result.mixAll = () => {
          let s = '';
          for (var key of Object.keys(options)) {
            s += result[key].outerHTML;
          }
          return s;
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
    this.extract(url, this.options.extractOptions).then((entity) => {
      entity = this.options.purity(entity);
      this.handleImages(entity).then(() => {
        console.log('images loaded.');
      }).then(() => {
        this.loadHtml(entity);
      }).then(() => {
        console.log('html loaded.');
      });
    })
  }

  /**
   * Write the target nodes to html.
   * @param {*} entity 
   */
  loadHtml(entity) {
    const savepath = this.options.deriveLoadPath(entity);
    const dir = path.dirname(savepath);
    if(!fs.existsSync(dir))
      mkdirs(dir);
    fs.writeFile(savepath, entity.mixAll(), 'utf-8', (error) => {
      if (error) {
        console.log(error);
      }
    });
  }

  /**
   * Download image refered in the html to specified location,
   * change the url to local one. 
   * @param {*} entity 
   */
  handleImages(entity) {
    // loadImages
    const loadImages = (url) => new Promise((resolve, reject) => {
      http.get(new URL(url), (res) => {
        var source = '';
        res.setEncoding('binary');
        res.on('data', (chunk) => {
          source += chunk;
        });
        res.on('end', () => {
          resolve(source);
        })
      }).on('error', (error) => {
        console.log(error);
      });
    });

    // handleImages
    const map = this.options.deriveImageMap(entity);
    var sequence = Promise.resolve();
    const images = entity.content.querySelectorAll('img');
    [].map.call(images, (image) => {
      const [url, savepath, src] = map.get(image.src);
      sequence = sequence.then(() => {
        const dir = path.dirname(savepath);
        if(!fs.existsSync(dir))
          mkdirs(dir);
        loadImages(url).then((result) => {
          fs.writeFile(savepath, result, 'binary', (error) => {
            if (error) {
              console.log(error);
            }
          });
        });
      });
      removeAllAttributes(image).src = src;
      return image;
    });
    
    return sequence.then(() => {console.log(entity.content.outerHTML)});
  }

}


const m = new Machine({
  extractOptions: {
    title: '.entrytitle',
    author: '.author',
    content: '.entrybody',
    date: '.entrybottom',
  },
  rules: () => {},
  purity: (entity) => {
    const dateText = entity.date.textContent.slice(0, 16);
    entity.date.textContent = dateText;
    return entity;
  },
  deriveImageMap: (entity) => {
    const hostname = '127.0.0.1:3000';
    const map = new Map();
    const images = entity.content.querySelectorAll('img');
    const date = new Date(entity.date.textContent);
    const name = entity.url.slice(27, 42);
    const generateRandomStr = () => Math.random().toString(36).slice(2, 10);
    for (let image of images) {
      const savepath = `images/blog/${name}/${format(date, 'yyyy/MM/dd')}/${generateRandomStr()}.jpg`;
      const src = image.src;
      map.set(src, [
         + src.slice(31, src.length),
        path.resolve(__dirname, savepath),
        `${hostname}/${savepath}`
      ]);
    }
    return map;
  },
  deriveLoadPath: (entity) => {
    const id = /\d+(?=\.php)/.exec(entity.title.children[0].href)[0];
    const date = new Date(entity.date.textContent);
    const name = entity.url.slice(27, 43);
    const savepath = `views/blog/${name}/${format(date, 'yyyy/MM/dd')}${id}.html`;
    return path.resolve(__dirname, savepath);
  }
});

m.connect();

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


