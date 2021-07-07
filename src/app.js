const rssUrlId = 'rssUrl';

const html = `
<div class="container">
  <div class="row">
    <div class="col col-lg-2"></div>
    <div class="col">
      <input type="text" class="form-control" id="${rssUrlId}" aria-describedby="rssUrlHelp">
    </div>
    <div class="col-md-auto">
      <button type="submit" class="btn btn-primary">Добавить</button>
    </div>
    <div class="col col-lg-2"></div>
  </div>
</div>
`;

const render = () => {
  const form = document.createElement('form');
  form.innerHTML = html;
  document.body.appendChild(form);
};

export default () => {
  render();
};
