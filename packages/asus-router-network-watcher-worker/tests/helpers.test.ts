import { objectDidChange, parseBoolean } from '@/helpers';
import { expect, test } from 'vitest'

test('that we can parse a boolean by string', async () => {
  expect(parseBoolean('true', false)).toBe(true);
  expect(parseBoolean('false', false)).toBe(false);
  expect(parseBoolean('foo', false)).toBe(false);
  expect(parseBoolean('true', true)).toBe(true);
  expect(parseBoolean('false', true)).toBe(false);
  expect(parseBoolean('foo', true)).toBe(false);
  expect(parseBoolean(undefined, false)).toBe(false);
  expect(parseBoolean(null, false)).toBe(false);
  expect(parseBoolean(undefined, true)).toBe(true);
  expect(parseBoolean(null, true)).toBe(true);
});

test('that we can detect changes in objects', async () => {
  expect(objectDidChange({ foo: 'bar' }, { foo: 'bar' })).toBe(false);
  expect(objectDidChange({ bar: 'foo', foo: 'bar' }, { foo: 'bar', bar: 'foo' })).toBe(false);
  expect(objectDidChange({ bar: 'foo', foo: 'bar' }, { foo: 'bar', bar: 'foo', zoo: 'car' })).toBe(true);
});