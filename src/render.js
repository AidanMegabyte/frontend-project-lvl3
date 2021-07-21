// ID элементов формы
const headerId = 'header';
const formId = 'rssForm';
const rssUrlInputId = 'rssUrlInput';
const rssUrlInputLabelId = 'rssUrlInputLabel';
const rssAddButtonId = 'rssAddButton';
const feedbackTextId = 'feedbackText';
const postListContainerId = 'postListContainer';
const feedListContainerId = 'feedListContainer';

// Поле для URL в данных формы
const rssUrlFormData = 'url';

// ID элементов диалога предпросмотра поста
const postPreviewModalId = 'postPreviewModal';
const postPreviewHeaderLabelId = 'postPreviewHeaderLabel';
const postPreviewContentContainerId = 'postPreviewContentContainer';
const postPreviewReadFullButtonId = 'postPreviewReadFullButton';
const postPreviewCloseButtonId = 'postPreviewCloseButton';

// Состояние UI
const UiStatus = {
  INVALID: 'INVALID',
  LOADING: 'LOADING',
  LOADED_OK: 'LOADED_OK',
  LOADED_ERROR: 'LOADED_ERROR',
};

// Обработчик смены состояния UI
const renderUiStatusChange = (uiStatus) => {
  const form = document.getElementById(formId);
  const rssUrlInput = document.getElementById(rssUrlInputId);
  const feedbackText = document.getElementById(feedbackTextId);
  const rssAddButton = document.getElementById(rssAddButtonId);
  switch (uiStatus) {
    case UiStatus.INVALID:
      rssUrlInput.classList.add('is-invalid');
      rssUrlInput.removeAttribute('readonly');
      feedbackText.classList.remove('text-success');
      feedbackText.classList.add('text-danger');
      rssAddButton.removeAttribute('disabled');
      break;
    case UiStatus.LOADING:
      rssUrlInput.classList.remove('is-invalid');
      rssUrlInput.setAttribute('readonly', true);
      feedbackText.classList.remove('text-success');
      feedbackText.classList.remove('text-danger');
      rssAddButton.setAttribute('disabled', true);
      break;
    case UiStatus.LOADED_OK:
      rssUrlInput.classList.remove('is-invalid');
      rssUrlInput.removeAttribute('readonly');
      feedbackText.classList.add('text-success');
      feedbackText.classList.remove('text-danger');
      rssAddButton.removeAttribute('disabled');
      form.reset();
      rssUrlInput.focus();
      break;
    case UiStatus.LOADED_ERROR:
      rssUrlInput.classList.remove('is-invalid');
      rssUrlInput.removeAttribute('readonly');
      feedbackText.classList.remove('text-success');
      feedbackText.classList.add('text-danger');
      rssAddButton.removeAttribute('disabled');
      break;
    default:
      break;
  }
};

// Обработчик смены feedback-сообщения
const renderUiMsgChange = (msg) => {
  const feedbackText = document.getElementById(feedbackTextId);
  feedbackText.textContent = msg;
};

// Отрисовка фидов RSS
const renderRssFeeds = (feeds, t) => {
  const feedContainer = document.getElementById(feedListContainerId);
  feedContainer.innerHTML = [
    `<h4 class="pb-4">${t('feedListHeader')}</h4>`,
    ...feeds.flatMap(({
      id, title, description,
    }) => [
      `<div id="feed-${id}">`,
      `<h3 class="h6 m-0">${title}</h3>`,
      `<p class="small text-black-50">${description}</p>`,
      '</div>',
    ]),
  ].join('\n');
};

// Отрисовка постов RSS
const renderRssPosts = (posts, postRead, t) => {
  const postContainer = document.getElementById(postListContainerId);
  postContainer.innerHTML = [
    `<h4 class="pb-4">${t('postListHeader')}</h4>`,
    ...posts.flatMap(({
      id, title, link,
    }) => {
      const className = postRead.includes(id) ? 'fw-normal' : 'fw-bold';
      return [
        `<div id="post-${id}" class="row pb-4">`,
        `<a class="${className} col" href="${link}" target="_blank" data-post-id="${id}">${title}</a>`,
        `<button type="button" class="btn btn-outline-primary btn-sm col-auto" data-post-id="${id}" data-bs-toggle="modal" data-bs-target="#${postPreviewModalId}">${t('postPreviewButtonLabel')}</button>`,
        '</div>',
      ];
    }),
  ].join('\n');
};

// Перерисовка диалога предпросмотра поста
const renderPostPreviewDialogContent = ({ title, description, link }) => {
  document.getElementById(postPreviewHeaderLabelId).textContent = title;
  document.getElementById(postPreviewContentContainerId).textContent = description;
  document.getElementById(postPreviewReadFullButtonId).setAttribute('href', link);
};

// Отрисовка страницы
const renderPage = (t) => {
  document.getElementById(postPreviewReadFullButtonId).textContent = t('postPreviewDialog.readFullButtonLabel');
  document.getElementById(postPreviewCloseButtonId).textContent = t('postPreviewDialog.closeButtonLabel');
  document.getElementById(headerId).textContent = t('appHeader');
  document.getElementById(rssUrlInputId).setAttribute('name', rssUrlFormData);
  document.getElementById(rssUrlInputId).setAttribute('aria-label', rssUrlFormData);
  document.getElementById(rssUrlInputId).setAttribute('placeholder', t('rssForm.urlPlaceholder'));
  document.getElementById(rssUrlInputLabelId).textContent = t('rssForm.urlLabel');
  document.getElementById(rssAddButtonId).textContent = t('rssForm.submitButtonLabel');
};

export {
  formId,
  rssUrlInputId,
  rssAddButtonId,
  feedbackTextId,
  postListContainerId,
  feedListContainerId,
  rssUrlFormData,
  UiStatus,
  renderUiStatusChange,
  renderUiMsgChange,
  renderRssFeeds,
  renderRssPosts,
  renderPostPreviewDialogContent,
  renderPage,
};
