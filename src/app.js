import _ from 'lodash';
import i18next from 'i18next';
import createState from './state.js';
import {
  formId, renderPage, postListContainerId,
} from './render.js';
import ru from './locales/ru.json';
import { onRssFormSubmit, onPostClick, refreshFeeds } from './handlers.js';

export default () => {
  // Загрузка локализации
  const i18n = i18next.createInstance();
  return i18n.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  }, (err, t) => {
    // Отрисовка страницы
    renderPage(t);
    // Установка состояния приложения
    const state = createState(t);
    // Установка обработчиков событий
    document.getElementById(formId).addEventListener('submit', (event) => onRssFormSubmit(event, state, t));
    document.getElementById(postListContainerId).addEventListener('click', (event) => onPostClick(event, state));
    // Обновление постов в фидах каждые 5 секунд
    refreshFeeds(state, t);
  });
};
