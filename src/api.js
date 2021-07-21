import axios from 'axios';

export default {
  getRssContent: (rssUrl) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(rssUrl)}`),
};
