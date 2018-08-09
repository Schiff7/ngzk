/* /public/src/javascripts/utils/extract.js */
const http = require('http');
const { URL } = require('url');
const { JSDOM } = require('jsdom');
const path = require('path');
const fs = require('fs');

/**
 * 1. Get raw html
 * 2. Find the nodes of title, author, content and date
 * 3. Download the pictures and replace the remote picture resource urls to local ones
 * 4. Construct the Blog object
 */

class Blog {
  constructor(url, title, author, content, date) {
    this.url = url;
    this.title = title;
    this.author = author;
    this.content = content;
    this.date = date;
  }
}
class Machine {
  constructor(...entrys) {
    this.entrys = entrys;
    this.state = {
      author: null,
      date: null,
      count: 0
    };
    this.extract = this.extract.bind(this);
    this.getBlog = this.getBlog.bind(this);
    this.getImg = this.getImg.bind(this);
    this.loadImages = this.loadImages.bind(this);
  }

  run() {}

  explore(entry) {}

  extract(options) {
    const { url, title, author, content, date } = options;
    this.getBlog(url).then((result) => {
      const dom = new JSDOM(result);
      const doc = dom.window.document;
      const find = (string) => doc.querySelector(string);
      console.log(new Blog(url, find(title), find(author), find(content), find(date)));
      //console.log(loadImages(find(content)).outerHTML);
    });
  }
  /**
   * url: /views/{author}/{year}/{month}/XXX.html
   * XXX: day + id
   */
  getBlog(url) {
    const options = new URL(url);
    return new Promise((resolve, reject) => {
      http.get(options, (res) => {
        var resource = '';
        res.setEncoding('utf-8');
        res.on('data', (chunk) => {
          resource += chunk;
        });
        res.on('end', () => {
          resolve(resource.toString());
        });
      }).on('error', (error) => {
        reject(error);
      });
    }).catch((error) => {
      console.log(error);
    });
  }



  getImg(url) {
    const options = new URL(url);
    const filename = url;
    return new Promise((resolve, reject) => {
      http.get(options, (res) => {
        var resource = '';
        res.setEncoding('binary');
        res.on('data', (chunk) => {
          resource += chunk;
        });
        res.on('end', () => {
          resolve({resource, filepath});
        })
      }).on('error', (error) => {
        console.log(error);
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * url: /images/blog/{author}/{year}/{month}/{blog}/XXX.jpeg
   * XXX: id
   */
  loadImages(blog) {
    const imgs = blog.content.querySelectorAll('img');
    const { author, date } = this.state;
    for (img of imgs) {
      this.getImg(img.src).then((result) => {
      const filepath = path.resolve('/public/src/images/blog', author, );
      fs.writeFile(filepath, result.resource, 'binary', (error) => {
        if (error) {
          console.log(error);
        }
      })
    });
    }
    return content;
  }

}


new Machine().extract({
  url: '',
  title: '.entrytitle',
  author: '.author',
  content: '.entrybody',
  date: '.entrybottom'
});