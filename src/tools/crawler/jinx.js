const fs = require('fs');
const path = require('path');
const axios = require('axios');
const yaml = require('js-yaml');
const { JSDOM } = require('jsdom');
const log = require('./log');
const Utils = require('./utils');


// -------------------------- GLOBAL

const environment = 'DEV';

if ( environment === 'DEV' ) console.log(environment);

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