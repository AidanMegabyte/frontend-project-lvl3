import _ from 'lodash';
import * as yup from 'yup';
import i18next from 'i18next';
import createState from './state.js';
import {
  formId, rssUrlFormData, UiStatus, renderPage, postListContainerId,
} from './render.js';
import api from './api.js';
import parseRss from './rss-parser.js';
import ru from './locales/ru.json';

// Генерация следующего ID
const getNextId = (items) => (_.max(items.map((item) => item.id || 0)) || 0) + 1;

// Обработчик успешного получения RSS
const onGetRssSuccess = (state, data, rssUrl, i18) => {
  const rss = parseRss(data.contents);
  const newFeed = !_.find(state.feeds, (feed) => feed.url === rssUrl);
  if (newFeed) {
    rss.feed.url = rssUrl;
    rss.feed.id = getNextId(state.feeds);
    _.set(state, 'feeds', [rss.feed, ...state.feeds]);
  }
  const newPosts = _.differenceWith(rss.posts, state.posts, (newPost, oldPost) => {
    const keys = [
      'title',
      'description',
      'link',
    ];
    return keys.every((key) => newPost[key] === oldPost[key]);
  });
  newPosts.forEach((post, i) => {
    _.set(post, 'id', getNextId(state.posts) + i);
  });
  _.set(state, 'posts', [...newPosts, ...state.posts]);
  if (newFeed) {
    _.set(state.uiState, 'status', UiStatus.LOADED_OK);
    _.set(state.uiState, 'msg', i18.t('messages.rssLoadedOk'));
  }
};

// Обработчик ошибок добавления URL
const onAddRssUrlError = (state, error, i18) => {
  if (error.name === 'ValidationError') {
    if (error.type === 'url') {
      _.set(state.uiState, 'status', UiStatus.INVALID);
      _.set(state.uiState, 'msg', i18.t('messages.rssUrlInvalid'));
    }
  } else {
    _.set(state.uiState, 'status', UiStatus.LOADED_ERROR);
    _.set(state.uiState, 'msg', i18.t('messages.rssLoadedOError'));
  }
};

export default () => {
  // Загрузка локализации
  const i18 = i18next.createInstance();
  i18.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  });
  // Отрисовка страницы
  renderPage(i18);
  // Установка состояния приложения
  const state = createState(i18);
  // Обработчик отправки формы
  document.getElementById(formId).addEventListener('submit', (event) => {
    event.preventDefault();
    const rssUrl = new FormData(event.target).get(rssUrlFormData).trim();
    if (_.find(state.feeds, (feed) => feed.url === rssUrl)) {
      _.set(state.uiState, 'status', UiStatus.INVALID);
      _.set(state.uiState, 'msg', i18.t('messages.rssExists'));
      return;
    }
    const urlValidationSchema = yup.string().required().url();
    urlValidationSchema.validate(rssUrl)
      .then(() => {
        _.set(state.uiState, 'status', UiStatus.LOADING);
        _.set(state.uiState, 'msg', '');
        return api.getRssContent(rssUrl);
      })
      .then(({ data }) => onGetRssSuccess(state, data, rssUrl, i18))
      .catch((error) => onAddRssUrlError(state, error, i18));
  });
  // Обработчик клика по посту
  document.getElementById(postListContainerId).addEventListener('click', (event) => {
    const { dataset } = event.target;
    if (!_.has(dataset, 'postId')) {
      return;
    }
    const postId = parseInt(dataset.postId, 10);
    state.uiState.postRead.push(postId);
    if (event.target.type === 'button') {
      state.uiState.selectedPostId = postId;
    }
  });
  // Обновление постов в фидах каждые 5 секунд
  const refreshFeeds = () => {
    const feedPromises = state.feeds.map((feed) => api.getRssContent(feed.url));
    if (feedPromises.length > 0) {
      Promise.all(feedPromises)
        .then((responses) => {
          const dataList = responses.map((response) => response.data);
          dataList.forEach((data, i) => onGetRssSuccess(state, data, state.feeds[i].url, i18));
        });
    }
    setTimeout(refreshFeeds, 5000);
  };
  refreshFeeds();
};
