import {
  jest, beforeEach, expect, test,
} from '@jest/globals';
import { promises as fsp } from 'fs';
import { waitFor } from '@testing-library/dom';
import testingLibraryUserEvent from '@testing-library/user-event';
import { getFixturePath, getDomElementById } from './common.js';
import startApp from '../src/app.js';
import {
  formId,
  rssUrlInputId,
  rssAddButtonId,
  feedbackTextId,
  postListContainerId,
  feedListContainerId,
} from '../src/render.js';
import api from '../src/api.js';
import messages from '../src/messages.js';

const userEvent = testingLibraryUserEvent.default;

beforeEach(() => startApp());

test('Starting application', () => {
  expect(getDomElementById(formId)).toBeDefined();
  expect(getDomElementById(rssUrlInputId)).toBeDefined();
  expect(getDomElementById(rssAddButtonId)).toBeDefined();
  expect(getDomElementById(feedbackTextId)).toBeDefined();
  expect(getDomElementById(postListContainerId)).toBeDefined();
  expect(getDomElementById(feedListContainerId)).toBeDefined();
});

test('Empty RSS URL', () => {
  userEvent.click(getDomElementById(rssAddButtonId));
  return waitFor(() => {
    expect(getDomElementById(rssUrlInputId)).not.toHaveClass('is-invalid');
    expect(getDomElementById(postListContainerId).innerHTML.trim()).toEqual('');
    expect(getDomElementById(feedListContainerId).innerHTML.trim()).toEqual('');
    expect(getDomElementById(feedbackTextId)).toBeEmptyDOMElement();
    expect(getDomElementById(rssUrlInputId)).not.toHaveClass('is-invalid');
    expect(getDomElementById(feedbackTextId)).not.toHaveClass('text-success');
    expect(getDomElementById(feedbackTextId)).not.toHaveClass('text-danger');
  });
});

test('RSS URL validation', () => {
  userEvent.type(getDomElementById(rssUrlInputId), 'qwe');
  userEvent.click(getDomElementById(rssAddButtonId));
  return waitFor(() => {
    expect(getDomElementById(rssUrlInputId)).toHaveClass('is-invalid');
    expect(getDomElementById(postListContainerId).innerHTML.trim()).toEqual('');
    expect(getDomElementById(feedListContainerId).innerHTML.trim()).toEqual('');
    expect(getDomElementById(feedbackTextId)).toHaveTextContent(messages.RSS_URL_INVALID);
    expect(getDomElementById(feedbackTextId)).not.toHaveClass('text-success');
    expect(getDomElementById(feedbackTextId)).toHaveClass('text-danger');
  });
});

test('Downloading RSS - success', () => Promise.all([
  fsp.readFile(getFixturePath('app/rss.xml'), 'utf-8'),
  fsp.readFile(getFixturePath('app/rss.json'), 'utf-8'),
]).then(([rssXml, rssJson]) => {
  const response = { data: { contents: rssXml } };
  const getRssContent = jest.spyOn(api, 'getRssContent');
  getRssContent.mockImplementationOnce(() => {
    expect(getDomElementById(rssUrlInputId)).not.toHaveClass('is-invalid');
    expect(getDomElementById(feedbackTextId)).not.toHaveClass('text-success');
    expect(getDomElementById(feedbackTextId)).not.toHaveClass('text-danger');
    expect(getDomElementById(rssAddButtonId)).toHaveAttribute('disabled');
    expect(getDomElementById(feedbackTextId)).toBeEmptyDOMElement();
    return Promise.resolve(response);
  });
  const rss = JSON.parse(rssJson);
  userEvent.type(getDomElementById(rssUrlInputId), 'http://example.com/');
  userEvent.click(getDomElementById(rssAddButtonId));
  return waitFor(() => {
    expect(getDomElementById(rssAddButtonId)).not.toHaveAttribute('disabled');
    expect(getDomElementById(rssUrlInputId).value).toEqual('');
    expect(getDomElementById(feedListContainerId)).toHaveTextContent(rss.feed.title);
    expect(getDomElementById(feedListContainerId)).toHaveTextContent(rss.feed.description);
    expect(getDomElementById(feedListContainerId).querySelector('a')).toHaveAttribute('href', rss.feed.link);
    expect(getDomElementById(postListContainerId)).toHaveTextContent(rss.posts[0].title);
    expect(getDomElementById(postListContainerId)).toHaveTextContent(rss.posts[0].description);
    expect(getDomElementById(postListContainerId).querySelector('a')).toHaveAttribute('href', rss.posts[0].link);
    expect(getDomElementById(feedbackTextId)).toHaveTextContent(messages.RSS_LOADED_OK);
    expect(getDomElementById(rssUrlInputId)).not.toHaveClass('is-invalid');
    expect(getDomElementById(feedbackTextId)).toHaveClass('text-success');
    expect(getDomElementById(feedbackTextId)).not.toHaveClass('text-danger');
  });
}));

test('Downloading RSS - error', () => {
  const getRssContent = jest.spyOn(api, 'getRssContent');
  getRssContent.mockImplementationOnce(() => {
    expect(getDomElementById(rssAddButtonId)).toHaveAttribute('disabled');
    expect(getDomElementById(rssUrlInputId)).not.toHaveClass('is-invalid');
    expect(getDomElementById(feedbackTextId)).not.toHaveClass('text-success');
    expect(getDomElementById(feedbackTextId)).not.toHaveClass('text-danger');
    expect(getDomElementById(feedbackTextId)).toBeEmptyDOMElement();
    return Promise.reject(new Error('abyrvalg'));
  });
  userEvent.type(getDomElementById(rssUrlInputId), 'http://example.com/');
  userEvent.click(getDomElementById(rssAddButtonId));
  return waitFor(() => {
    expect(getDomElementById(rssAddButtonId)).not.toHaveAttribute('disabled');
    expect(getDomElementById(postListContainerId).innerHTML.trim()).toEqual('');
    expect(getDomElementById(feedListContainerId).innerHTML.trim()).toEqual('');
    expect(getDomElementById(feedbackTextId)).toHaveTextContent(messages.RSS_LOADED_ERROR);
    expect(getDomElementById(rssUrlInputId)).not.toHaveClass('is-invalid');
    expect(getDomElementById(feedbackTextId)).not.toHaveClass('text-success');
    expect(getDomElementById(feedbackTextId)).toHaveClass('text-danger');
  });
});
