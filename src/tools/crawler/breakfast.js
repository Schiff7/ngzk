// breakfast.
const Utils = require('./utils');
const members = require('./members');


function breakfast() {
  const date = Utils.format(new Date(), 'yyyyMMdd');
  const urls = members.namespace('.').map(name => `http://blog.nogizaka46.com/${name}/?d=${date}`);
  console.log(urls);
}

breakfast();