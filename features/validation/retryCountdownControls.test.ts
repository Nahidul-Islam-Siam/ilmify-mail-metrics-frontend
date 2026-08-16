import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { test } from 'node:test';
import {
  RetryCountdownNotice,
  RetrySubmitButton,
} from './components/RetryCountdownControls';

test('rate-limited controls disable submission and announce the remaining wait', () => {
  const button = renderToStaticMarkup(
    createElement(RetrySubmitButton, { loading: false, retrySeconds: 47 }),
  );
  const notice = renderToStaticMarkup(
    createElement(RetryCountdownNotice, { retrySeconds: 47 }),
  );

  assert.match(button, /disabled=""/);
  assert.match(button, />Retry in 47s<\/button>/);
  assert.match(notice, /role="status"/);
  assert.match(notice, /aria-live="polite"/);
  assert.match(notice, /Too many checks\. Try again in 00:47/);
});

test('normal controls allow submission and omit the countdown notice', () => {
  const button = renderToStaticMarkup(
    createElement(RetrySubmitButton, { loading: false, retrySeconds: 0 }),
  );
  const notice = renderToStaticMarkup(
    createElement(RetryCountdownNotice, { retrySeconds: 0 }),
  );

  assert.doesNotMatch(button, /disabled=/);
  assert.match(button, />Validate email<\/button>/);
  assert.equal(notice, '');
});

test('loading label takes precedence while the request is active', () => {
  const button = renderToStaticMarkup(
    createElement(RetrySubmitButton, { loading: true, retrySeconds: 0 }),
  );

  assert.match(button, /disabled=""/);
  assert.match(button, />Validating…<\/button>/);
});
