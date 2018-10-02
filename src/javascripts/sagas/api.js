/* /src/javascripts/sagas/api.js */
import axios from 'axios';
import yaml from 'js-yaml';
import { format } from 'utils';

const HOSTNAME = 'https://nyctophilia.github.io/ngzk/src';

const fetchProf = async (name) => {
  try {
    const prof = await axios.get(`${HOSTNAME}/views/profile/${name}.yaml`);
    return yaml.safeLoad(prof.data);
  } catch (error) {
    console.error(error);
  }
}

const fetchBlog = async (name, date) => {
  try {
    const filename = '';
    const formatDate = format(date, 'yyyy/MM');
    const blog = await axios.get(`${HOSTNAME}/views/blog/${name}/${formatDate}/${filename}.yaml`);
    return yaml.safeLoad(blog.data);
  } catch (error) {
    console.error(error);
  }
}

const fetchContents = async (name) => {
  try {
    const contents = await axios.get(`${HOSTNAME}}/views/contents/${name}.yaml`);
    return yaml.safeLoad(contents.data);
  } catch (error) {
    console.error(error);
  }
}

export default { fetchProf, fetchBlog, fetchContents };