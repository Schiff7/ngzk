/* /src/javascripts/sagas/api.js */
import axios from 'axios';
import yaml from 'js-yaml';

const HOSTNAME = 'https://hymain.github.io/ngzk/src';

const fetchProf = async (name) => {
  try {
    const prof = await axios.get(`${HOSTNAME}/views/profile/${name}.yaml`);
    return yaml.safeLoad(prof.data);
  } catch (error) {
    console.error(error);
  }
}

const fetchContents = async (name) => {
  try {
    const contents = await axios.get(`${HOSTNAME}/views/contents/${name}.yaml`);
    const raw = yaml.safeLoad(contents.data);
    return { raw };
  } catch (error) {
    console.error(error);
  }
}

const fetchArticle = async (location) => {
  try {
    const article = await axios.get(`${HOSTNAME}/views/blog/${location}.yaml`);
    const raw = yaml.safeLoad(article.data);
    raw.content = raw.content.replace(/src="([a-zA-Z0-9_/.]+?)"/g, `src="${HOSTNAME}$1"`);
    return raw;
  } catch (error) {
    console.error(error);
  }
}


export default { fetchProf, fetchContents, fetchArticle };