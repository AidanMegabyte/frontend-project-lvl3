import onChange from 'on-change';
import _ from 'lodash';
import {
  renderUiStatusChange,
  renderUiMsgChange,
  renderRssFeeds,
  renderRssPosts,
  renderPostPreviewDialogContent,
} from './render.js';

// Состояние приложения
const stateOriginal = {
  posts: [],
  feeds: [],
  uiState: {
    status: '',
    msg: '',
    postRead: [],
    selectedPostId: null,
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
    case 'uiState.postRead':
      renderRssPosts(stateOriginal.posts, value, i18);
      break;
    case 'uiState.selectedPostId':
      if (value) {
        const selectedPost = _.find(stateOriginal.posts, (post) => post.id === value);
        renderPostPreviewDialogContent(selectedPost);
      }
      break;
    case 'feeds':
      renderRssFeeds(value, i18);
      break;
    case 'posts':
      renderRssPosts(value, stateOriginal.uiState.postRead, i18);
      break;
    default:
      break;
  }
});

export default createState;
