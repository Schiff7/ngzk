// breakfast.
const Utils = require('./utils');
const members = require('./members');
const m = require('./jinx');

function breakfast() {
  const date = Utils.format(new Date(), 'yyyyMMdd');
  const requests = members.namespace('.')
    .map(name => () => m.connect(`http://blog.nogizaka46.com/${name}/?d=${date}`));
  Utils.all(requests);
}

breakfast();