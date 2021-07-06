import _ from 'lodash';

const render = () => {
  const form = document.createElement('form');
  form.innerHTML = _.join([
    '<input type="text" class="form-control" id="rssUrl" aria-describedby="rssUrlHelp">',
    '<div id="rssUrlHelp" class="form-text">Пример: https://ru.hexlet.io/lessons.rss</div>',
    '<button type="submit" class="btn btn-primary">Добавить</button>',
  ], '\n');
  document.body.appendChild(form);
};

export default () => {
  render();
};
