/* /src/javascripts/sagas/api.js */
import axios from 'axios';
import yaml from 'js-yaml';

const HOSTNAME = 'https://hymain.github.io/ngzk/src';

const fetchProf = async (name) => {
  try {
    const prof = await axios.get(`${HOSTNAME}/views/profile/${name}.yml`);
    return yaml.safeLoad(prof.data);
  } catch (error) {
    console.error(error);
  }
}

const fetchContents = async (name) => {
  try {
    const contents = await axios.get(`${HOSTNAME}/views/contents/${name}.yml`);
    return yaml.safeLoad(contents.data);
  } catch (error) {
    console.error(error);
  }
}

const fetchArticle = async (location) => {
  try {
    const article = await axios.get(`${HOSTNAME}/views/blog/${location}.yml`);
    const data = yaml.safeLoad(article.data);
    const div = document.createElement('div');
    div.innerHTML = data.content;
    [...div.querySelectorAll('img')].map(i => {
      i.src = `${HOSTNAME}${i['getAttribute']('src')}`;
      i.onerror = function() {
        const img = event.srcElement;
        img.src = '';
        img.onerror = null;
      }
    });
    data.content = div.innerHTML;
    return data;
  } catch (error) {
    console.error(error);
  }
}


export default { fetchProf, fetchContents, fetchArticle };