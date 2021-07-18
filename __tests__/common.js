import * as path from 'path';

const getFixturePath = (fixtureFileName) => path.resolve(process.cwd(), `__fixtures__/${fixtureFileName}`);

const getDomElementById = (id) => document.querySelector(`#${id}`);

export {
  getFixturePath,
  getDomElementById,
};
