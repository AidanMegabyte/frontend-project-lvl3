import onChange from 'on-change';
import api from './api.js';
import {
  renderUiStatusChange, renderUiMsgChange, renderRssFeeds, renderRssPosts,
} from './render.js';

// Состояние приложения
const stateOriginal = {
  posts: [],
  feeds: [],
  uiState: {
    status: '',
    msg: '',
  },
};

// Создание наблюдаемого состояния приложения
const createState = (i18) => onChange(stateOriginal, (path, value) => {
  switch (path) {
    case 'uiState.status':
      renderUiStatusChange(value);
      break;
    case 'uiState.msg':
      renderUiMsgChange(value);
      break;
    case 'lastRssUrl':
      api.getRssContent(value);
      break;
    case 'feeds':
      renderRssFeeds(value, i18);
      break;
    case 'posts':
      renderRssPosts(value, i18);
      break;
    default:
      break;
  }
});

export default createState;
