import { JSDOM } from 'jsdom';
import fs from 'node:fs';
export const key = 'gohan:mini-pos:v1';
export const mount = (saved, fetchResult = { ok: true, json: async () => ({ quote: 'Stay curious.', author: 'Test' }) }) => {
  const dom = new JSDOM(fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8'), {
    url: 'http://localhost/', runScripts: 'outside-only',
  });
  if (saved !== undefined) dom.window.localStorage.setItem(key, typeof saved === 'string' ? saved : JSON.stringify(saved));
  dom.window.fetch = typeof fetchResult === 'function' ? fetchResult : async () => fetchResult;
  dom.window.eval(fs.readFileSync(new URL('../script.js', import.meta.url), 'utf8'));
  const doc = dom.window.document;
  const $ = (id) => doc.getElementById(id);
  const input = (id, value) => {
    $(id).value = value; $(id).dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  };
  const submit = (id) => $(id).dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  return { dom, $, input, submit, close: () => dom.window.close() };
};
