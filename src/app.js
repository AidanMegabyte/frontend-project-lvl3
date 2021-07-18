import _ from 'lodash';
import * as yup from 'yup';
import i18next from 'i18next';
import createState from './state.js';
import {
  formId, rssUrlFormData, UiStatus, renderPage,
} from './render.js';
import api from './api.js';
import parseRss from './rss-parser.js';
import ru from './locales/ru.json';

// Генерация следующего ID
const getNextId = (items) => (_.max(items.map((item) => item.id || 0)) || 0) + 1;

// Обработчик успешного получения RSS
const onGetRssSuccess = (state, data) => {
  const rss = parseRss(data.contents);
  rss.feed.id = getNextId(state.feeds);
  rss.posts.forEach((post, i) => {
    _.set(post, 'id', getNextId(state.posts) + i);
  });
  _.set(state, 'feeds', [rss.feed, ...state.feeds]);
  _.set(state, 'posts', [...rss.posts, ...state.posts]);
  _.set(state.uiState, 'status', UiStatus.LOADED_OK);
  _.set(state.uiState, 'msg', i18next.t('messages.rssLoadedOk'));
};

// Обработчик ошибок добавления URL
const onAddRssUrlError = (state, error) => {
  if (error.name === 'ValidationError') {
    if (error.type === 'url') {
      _.set(state.uiState, 'status', UiStatus.INVALID);
      _.set(state.uiState, 'msg', i18next.t('messages.rssUrlInvalid'));
    }
  } else {
    _.set(state.uiState, 'status', UiStatus.LOADED_ERROR);
    _.set(state.uiState, 'msg', i18next.t('messages.rssLoadedOError'));
  }
};

export default () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }).then(() => {
    renderPage();
    const state = createState();
    document.getElementById(formId).addEventListener('submit', (event) => {
      event.preventDefault();
      const urlValidationSchema = yup.string().required().url();
      const rssUrl = new FormData(event.target).get(rssUrlFormData).trim();
      urlValidationSchema.validate(rssUrl)
        .then(() => {
          _.set(state.uiState, 'status', UiStatus.LOADING);
          _.set(state.uiState, 'msg', '');
          return api.getRssContent(rssUrl);
        })
        .then(({ data }) => onGetRssSuccess(state, data))
        .catch((error) => onAddRssUrlError(state, error));
    });
  });
};
