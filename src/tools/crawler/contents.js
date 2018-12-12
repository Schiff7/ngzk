// create contents.
const Utils = require('./utils');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function contents(name) {
  const from = path.resolve(Utils.foldback(__dirname, 2), 'views/blog');
  const to = path.resolve(Utils.foldback(__dirname, 2), 'views/contents');
  const _contents = yaml.dump(Utils.read(path.resolve(from, name)));
  const writable = fs.createWriteStream(path.resolve(to, `${name}.yml`));
  writable.write(_contents, 'utf-8', (error) => { if (error) console.error(error) });
}

contents('yuuki_yoda');