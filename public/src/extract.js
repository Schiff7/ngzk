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
      handleImages: (entity) => {},
      handleEntity: (entity) => {},
    }
    Object.assign(this.options, options);
    // bind this.
    this.extract = this.extract.bind(this);
    this.explore = this.explore.bind(this);
    this.run = this.run.bind(this);
    this.handleImages = this.handleImages.bind(this);
    this.dirty = this.dirty.bind(this);
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
        resolve(result);
      });
    });
  }


  dirty(url, options) {
    this.extract(url, options).then((entity) => {
      const dateText = entity.date.textContent.slice(0, 16);
      entity.date.textContent = dateText;
      const date = new Date(dateText);
      const author = entity.url.slice(27, 43);
      const locationOfImages = path.resolve(__dirname, `images/blog/${author}/${format(date, 'yyyy/MM/dd')}`);
      const locationOfHtmls = path.resolve(__dirname, `views/blog/${author}/${format(date, 'yyyy/MM/dd')}.html`)
      this.handleImages(entity.content, locationOfImages)
        .then(() => console.log('images loaded.'))
        .then(() => {
          const nodes = entity.title.outerHTML + entity.author.outerHTML + entity.content.outerHTML + entity.date.outerHTML;
          this.loadHtml(nodes, locationOfHtmls);
        }).then(() => console.log('html loaded.'));
    });
  }

  /**
   * Write the target nodes to html.
   * @param {*} nodes 
   * @param {*} location 
   */
  loadHtml(nodes, location) {
    if(!fs.existsSync(path.dirname(location)))
      mkdirs(path.dirname(location));
    fs.writeFile(location, nodes, 'utf-8', (error) => {
      if (error) {
        console.log(error);
      }
    });
  }

  /**
   * Download image refered in the html to specified location,
   * change the url to local one. 
   * @param {*} html 
   * @param {*} location 
   */
  handleImages(html, location) {
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
    const generateName = () => Math.random().toString(36).slice(2, 10).toUpperCase() + '.jpg';
    const imgs = html.querySelectorAll('img');
    var sequence = Promise.resolve();
    for (let img of imgs) {
      sequence = sequence.then(() => {
        const src = img.src;
        // DIRTY-----
        const newsrc =  + src.slice(31, src.length);
        // END--
        const name = generateName();
        if(!fs.existsSync(location))
          mkdirs(location);
        loadImages(newsrc).then((result) => {
          fs.writeFile(`${location}/${name}`, result, 'binary', (error) => {
            if (error) {
              console.log(error);
            }
          });
        });
      })
    }
    return sequence.then(() => html);
  }

}


new Machine().dirty(,{
  title: '.entrytitle',
  author: '.author',
  content: '.entrybody',
  date: '.entrybottom'
});


new Machine({
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
  handleImages: (entity) => {
    const hostname = localhost;
    const map = new Map();
    const images = entity.content.querySelectorAll('img');
    const date = new Date(entity.date.textContent);
    const name = entity.url.slice(27, 43);
    const generateRandomStr = () => Math.random().toString(36).slice(2, 10).toUpperCase();
    for (let image of images) {
      const savepath = `images/blog/${name}/${format(date, 'yyyy/MM/dd')}/${generateRandomStr}.jpg`;
      map.set(image.src, [
        path.resolve(__dirname, savepath),
        `${hostname}/${savepath}`
      ]);
    }
    return map;
  },
  handleEntity: (entity) => {

  }
});

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


