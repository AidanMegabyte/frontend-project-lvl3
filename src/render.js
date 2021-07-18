import i18next from 'i18next';

// ID элементов формы
const formId = 'rssForm';
const rssUrlInputId = 'rssUrlInput';
const rssAddButtonId = 'rssAddButton';
const feedbackTextId = 'feedbackText';
const postListContainerId = 'postListContainer';
const feedListContainerId = 'feedListContainer';

// Поле для URL в данных формы
const rssUrlFormData = 'rssUrl';

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

// Отрисовка части RSS
const renderRssPart = (partContainerId, partHeader, partItems, partItemIdPrefix) => {
  const partContainer = document.getElementById(partContainerId);
  partContainer.innerHTML = [
    `<h4 class="pb-4">${partHeader}</h4>`,
    ...partItems.flatMap(({
      id, title, description, link,
    }) => [
      `<div id="#${partItemIdPrefix}-${id}">`,
      `<a href="${link}" target="_blank"><b>${title}</b></a>`,
      `<p class="small text-black-50">${description}</p>`,
      '</div>',
    ]),
  ].join('\n');
};

// Отрисовка фидов RSS
const renderRssFeeds = (feeds) => renderRssPart(feedListContainerId, i18next.t('feedListHeader'), feeds, 'feed');

// Отрисовка постов RSS
const renderRssPosts = (posts) => renderRssPart(postListContainerId, i18next.t('postListHeader'), posts, 'post');

// Отрисовка страницы
const renderPage = () => {
  document.body.classList.add('d-flex', 'flex-column', 'vh-100');
  document.body.innerHTML = `
  <main class="container-fluid flex-grow-1">
    <section class="row bg-dark p-5">
      <div class="col-2"></div>
      <div class="col">
        <h1 class="display-4 pb-3 text-white">${i18next.t('appHeader')}</h1>
        <form id="${formId}" class="text-body">
          <div class="row">
            <div class="col">
              <div class="form-floating">
                <input type="text" class="form-control" required autofocus id="${rssUrlInputId}" name="${rssUrlFormData}" placeholder="${i18next.t('rssForm.urlPlaceholder')}">
                <label for="${rssUrlInputId}">${i18next.t('rssForm.urlLabel')}</label>
              </div>
            </div>
            <button id="${rssAddButtonId}" type="submit" class="col-auto btn btn-primary btn-lg px-sm-5">${i18next.t('rssForm.submitButtonLabel')}</button>
          </div>
        </form>
        <p id="${feedbackTextId}" class="pt-2 position-absolute small"></p>
      </div>
      <div class="col-2"></div>
    </section>
    <section class="row bg-white p-5">
      <div id="${postListContainerId}" class="col-8">
      </div>
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
  renderPage,
};
