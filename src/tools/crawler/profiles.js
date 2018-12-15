// get profiles.
const fs = require('fs');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const Utils = require('./utils');
const members = require('./members');
const yaml = require('js-yaml');

const fmap = (funs) => (params) => {
  const length = funs.length;
  const result = [];
  if ( params.length !== length ) return [];
  for ( let i = 0; i < length; i++ ) {
    console.log(params[i]);
    result.push(funs[i](params[i]));
  }
  return result;
}

async function profiles() {
  // here i want to use the `name` before the call chain but it was apparent that i cant get the value unless i keep every state modified by 
  // function and send it to the next function. so that would be
  // the issue in function programing ? i guess..
  const links = members.reverse().namespace('').names.map(name => `http://www.nogizaka46.com/member/detail/${name}.php`);
  const avatars_requests = [];
  const infos = [];
  for ( const link of links ) {
    const response = await axios({ url: link });
    const doc = JSDOM.fragment(response.data);
    const profile = doc.querySelector('#profile');
    const [ img, div ] = [...profile.children];
    avatars_requests.push(roma => {
      Utils.retry(() => axios({ url: img.src, responseType: 'stream' })).then(res => { 
        res.data.pipe(fs.createWriteStream(`${Utils.foldback(__dirname, 2)}/images/member/22/${roma}.jpg`));
      }).catch(error => console.error(error));
    });
    const [ h2, dl ] = [...div.children];
    const [ hiragana, name ] = h2.textContent.split('\n');
    const [ birthdate, abo, constellation, stature ] = [...dl.querySelectorAll('dd')].map(dd => dd.textContent);
    infos.push(roma => { 
      const writable = fs.createWriteStream(`${Utils.foldback(__dirname, 2)}/views/profile/${roma}.yml`);
      writable.write( yaml.safeDump({ name, hiragana, birthdate, abo, constellation, stature }), error => {
        if (error) console.error(error);
      });
    })
  }

  fmap(avatars_requests)(members.namespace('_').names);
  // fmap(infos)(members.namespace('_'));
}

profiles();