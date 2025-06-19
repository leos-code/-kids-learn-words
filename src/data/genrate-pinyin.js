import pkg from 'pinyin';
import fs from 'fs';

const pinyin = pkg.default ?? pkg; // 兼容 default 导出或整个模块

const chars = fs.readFileSync('common-words-1.txt', 'utf8').replace(/\s+/g, '').split('');
const uniqueChars = Array.from(new Set(chars));

const pinyinMap = {};
const wordGroupsMap = {};

uniqueChars.forEach(char => {
  pinyinMap[char] = pinyin(char, {style: pinyin.STYLE_TONE2})[0][0];
  wordGroupsMap[char] = [`${char}字`, `${char}的`];
});

console.log('pinyinMap:', JSON.stringify(pinyinMap, null, 2));
console.log('wordGroupsMap:', JSON.stringify(wordGroupsMap, null, 2));
console.log('commonWords:', JSON.stringify(uniqueChars));