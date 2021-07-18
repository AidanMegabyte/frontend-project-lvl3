import { expect, test } from '@jest/globals';
import { promises as fsp } from 'fs';
import { getFixturePath } from './common.js';
import parseRss from '../src/rss-parser.js';

test('RSS parsing', () => Promise.all([
  fsp.readFile(getFixturePath('rss-parser/rss.json'), 'utf-8'),
  fsp.readFile(getFixturePath('rss-parser/rss.xml'), 'utf-8'),
]).then(([rssJson, rssXml]) => {
  const expected = JSON.parse(rssJson);
  const actual = parseRss(rssXml);
  expect(actual).toEqual(expected);
}));
