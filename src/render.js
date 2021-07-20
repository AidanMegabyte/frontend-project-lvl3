// ID элементов формы
const formId = 'rssForm';
const rssUrlInputId = 'rssUrlInput';
const rssAddButtonId = 'rssAddButton';
const feedbackTextId = 'feedbackText';
const postListContainerId = 'postListContainer';
const feedListContainerId = 'feedListContainer';

// Поле для URL в данных формы
const rssUrlFormData = 'rssUrl';

// ID элементов диалога предпросмотра поста
const postPreviewModalId = 'postPreviewModal';
const postPreviewHeaderLabelId = 'postPreviewHeaderLabel';
const postPreviewContentContainerId = 'postPreviewContentContainer';
const postPreviewReadFullButtonId = 'postPreviewReadFullButton';

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
      feedbackText.classList.remove('text-success');
      feedbackText.classList.add('text-danger');
      rssAddButton.removeAttribute('disabled');
      break;
    case UiStatus.LOADING:
      rssUrlInput.classList.remove('is-invalid');
      feedbackText.classList.remove('text-success');
      feedbackText.classList.remove('text-danger');
      rssAddButton.setAttribute('disabled', true);
      break;
    case UiStatus.LOADED_OK:
      rssUrlInput.classList.remove('is-invalid');
      feedbackText.classList.add('text-success');
      feedbackText.classList.remove('text-danger');
      rssAddButton.removeAttribute('disabled');
      form.reset();
      rssUrlInput.focus();
      break;
    case UiStatus.LOADED_ERROR:
      rssUrlInput.classList.remove('is-invalid');
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
const renderRssFeeds = (feeds, i18) => {
  const feedContainer = document.getElementById(feedListContainerId);
  feedContainer.innerHTML = [
    `<h4 class="pb-4">${i18.t('feedListHeader')}</h4>`,
    ...feeds.flatMap(({
      id, title, description,
    }) => [
      `<div id="#feed-${id}">`,
      `<h3 class="h6 m-0">${title}</h3>`,
      `<p class="small text-black-50">${description}</p>`,
      '</div>',
    ]),
  ].join('\n');
};

// Отрисовка постов RSS
const renderRssPosts = (posts, postRead, i18) => {
  const postContainer = document.getElementById(postListContainerId);
  postContainer.innerHTML = [
    `<h4 class="pb-4">${i18.t('postListHeader')}</h4>`,
    ...posts.flatMap(({
      id, title, link,
    }) => {
      const className = postRead.includes(id) ? 'fw-normal' : 'fw-bold';
      return [
        `<div id="#post-${id}" class="row pb-4">`,
        `<a class="${className} col" href="${link}" target="_blank" data-post-id="${id}">${title}</a>`,
        `<button type="button" class="btn btn-outline-primary btn-sm col-auto" data-post-id="${id}" data-bs-toggle="modal" data-bs-target="#${postPreviewModalId}">${i18.t('postPreviewButtonLabel')}</button>`,
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
const renderPage = (i18) => {
  document.body.classList.add('d-flex', 'flex-column', 'vh-100');
  document.body.innerHTML = `
  <div class="modal fade" id="${postPreviewModalId}" tabindex="-1" aria-labelledby="${postPreviewModalId}" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="${postPreviewHeaderLabelId}"></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="${postPreviewContentContainerId}" class="modal-body">
        </div>
        <div class="modal-footer">
          <a id="${postPreviewReadFullButtonId}" class="btn btn-primary" href="#" role="button" target="_blank">${i18.t('postPreviewDialog.readFullButtonLabel')}</a>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18.t('postPreviewDialog.closeButtonLabel')}</button>
        </div>
      </div>
    </div>
  </div>
  <main class="container-fluid flex-grow-1">
    <section class="row bg-dark p-5">
      <div class="col-2"></div>
      <div class="col">
        <h1 class="display-4 pb-3 text-white">${i18.t('appHeader')}</h1>
        <form id="${formId}" class="text-body">
          <div class="row">
            <div class="col">
              <div class="form-floating">
                <input type="text" class="form-control" required autofocus id="${rssUrlInputId}" name="${rssUrlFormData}" placeholder="${i18.t('rssForm.urlPlaceholder')}">
                <label for="${rssUrlInputId}">${i18.t('rssForm.urlLabel')}</label>
              </div>
            </div>
            <button id="${rssAddButtonId}" type="submit" class="col-auto btn btn-primary btn-lg px-sm-5">${i18.t('rssForm.submitButtonLabel')}</button>
          </div>
        </form>
        <p id="${feedbackTextId}" class="pt-2 position-absolute small"></p>
      </div>
      <div class="col-2"></div>
    </section>
    <section class="row bg-white p-5">
      <div id="${postListContainerId}" class="col-8">
      </div>
      <div class="col-sm-1"></div>
      <div id="${feedListContainerId}" class="col">
      </div>
    </section>
  </main>
  `;
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
