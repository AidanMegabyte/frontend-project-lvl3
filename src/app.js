const formId = 'rssForm';
const rssUrlId = 'rssUrlInput';
const rssAddBtnId = 'rssAddButton';

const html = `
<main class="container-fluid flex-grow-1">
  <section class="row bg-dark p-5">
    <div class="col-2"></div>
    <div class="col">
      <h1 class="display-4 pb-3 text-white">RSS-агрегатор</h1>
      <form id="${formId}" class="text-body">
        <div class="row">
          <div class="col">
            <div class="form-floating">
              <input type="text" class="form-control" id="${rssUrlId}" placeholder="Ссылка RSS">
              <label for="${rssUrlId}">Ссылка RSS</label>
            </div>
          </div>
          <button id="${rssAddBtnId}" type="submit" class="col-auto btn btn-primary btn-lg px-sm-5">Добавить</button>
        </div>
      </form>
    </div>
    <div class="col-2"></div>
  </section>
</main>
`;

const render = () => {
  document.body.classList.add('d-flex', 'flex-column', 'vh-100');
  document.body.innerHTML = html;
  document.querySelector(`#${rssUrlId}`).focus();
};

export default () => {
  render();
};
