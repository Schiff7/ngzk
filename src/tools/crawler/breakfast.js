// breakfast.
const Utils = require('./jinx');
const members = require('./members');
const { replace } = require('lodash');


function breakfast() {
  const date = Utils.format(new Date(), 'yyyyMMdd');
  const urls = members.map(name => `http://blog.nogizaka46.com/${replace(name, /\s/, '.')}/?d=${date}`);
  console.log(urls);
}

breakfast();