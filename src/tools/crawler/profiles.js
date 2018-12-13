// get profiles.
const fs = require('fs');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const Utils = require('./utils');
const members = require('./members');

async function profiles() {
  // here i want to use the `name` before the call chain but it was apparent that i cant get the value unless i keep every state modified by 
  // function and send it to the next function. so that would be
  // the issue in function programing ? i guess..
  const links = members.reverse().namespace('').names.map(name => `http://www.nogizaka46.com/member/detail/${name}.php`);
  for ( link of links ) {
    const response = await axios({ url: link });
    const doc = JSDOM.fragment(response);
    const profile = doc.querySelector('#profile');
  }
}

profiles();