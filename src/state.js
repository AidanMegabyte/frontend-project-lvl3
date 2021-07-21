import onChange from 'on-change';
import _ from 'lodash';
import {
  renderUiStatusChange,
  renderUiMsgChange,
  renderRssFeeds,
  renderRssPosts,
  renderPostPreviewDialogContent,
} from './render.js';

// Создание наблюдаемого состояния приложения
const createState = (t) => {
  console.log('New state creation');
  // Начальное состояние
  const state = {
    posts: [],
    feeds: [],
    uiState: {
      status: '',
      msg: '',
      postRead: [],
      selectedPostId: null,
    },
  };
  return onChange(state, (path, value) => {
    console.log(`Current state:\n${JSON.stringify(state)}`);
    switch (path) {
      case 'uiState.status':
        renderUiStatusChange(value);
        break;
      case 'uiState.msg':
        renderUiMsgChange(value);
        break;
      case 'uiState.postRead':
        renderRssPosts(state.posts, value, t);
        break;
      case 'uiState.selectedPostId':
        if (value) {
          const selectedPost = _.find(state.posts, (post) => post.id === value);
          renderPostPreviewDialogContent(selectedPost);
        }
        break;
      case 'feeds':
        renderRssFeeds(value, t);
        break;
      case 'posts':
        renderRssPosts(value, state.uiState.postRead, t);
        break;
      default:
        break;
    }
  });
};

export default createState;
