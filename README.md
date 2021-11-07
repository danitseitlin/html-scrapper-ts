<p align='center'>
  <a href='https://www.npmjs.com/package/html-scrapper-ts-ts'>
    <img src='https://img.shields.io/npm/v/html-scrapper-ts/latest?style=plastic' target='_blank' />
  </a>
  <a href='https://npmjs.org/package/html-scrapper-ts-ts' style='width:25px;height:20px;'>
    <img src='https://img.shields.io/npm/dm/html-scrapper-ts.svg?color=blue&style=plastic' target='_blank' />
  </a>
  <a href='https://github.com/danitseitlin/html-scrapper-ts-ts/issues' style='width:25px;height:20px;'>
    <img src='https://img.shields.io/github/issues/danitseitlin/html-scrapper-ts?style=plastic' target='_blank' />
  </a>
  <a href='https://npmjs.org/package/html-scrapper-ts' style='width:25px;height:20px;'>
    <img src='https://img.shields.io/bundlephobia/min/html-scrapper-ts/latest?style=plastic' target='_blank' />
  </a>
  <a href='https://github.com/danitseitlin/html-scrapper-ts/commits/master'>
    <img src='https://img.shields.io/github/last-commit/danitseitlin/html-scrapper-ts?style=plastic' />
  </a>
  <a href='https://github.com/danitseitlin/html-scrapper-ts/blob/master/LICENSE'>
    <img src='https://img.shields.io/badge/license-BSD%203%20Clause-blue.svg?style=plastic' target='_blank' />
  </a>
</p></p>
## A small tool to scrap HTML using Typescript!

### Installation
```
npm i --save-dev html-scrapper-ts
```
### Basic usage
```
import { HTML } from 'html-scrapper-ts';
const file = readFileSync('dir/my-file-path.html');
const htmlAsString = "<html><body><h1>Title!</h1></body></html>
const html1 = new HTML(file.toString());
const html2 = new HTML(htmlAsString);
//Get all elements data:
const allElements = html1.elements;

//Filter out elements by tag
const listOfH1 = html1.getElements('h1');

//Filter out by elements and their properties
const listOfH1WithId = html2.getElements('h1', [{
    name: 'class',
    value: 'my-special-class'
}])
```