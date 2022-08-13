import { HTMLParser } from "../src/parser";
import { readFileSync } from 'fs';
import path = require("path");
import { expect } from "chai";
describe('HTML Scrapping', async function() {
    it('getElements function', () => {
        const file = readFileSync(`${process.cwd()}${path.sep}tests${path.sep}samples${path.sep}1.html`)
        const html = new HTMLParser(file.toString());
        const tableList = html.getElements('table');
        expect(tableList.length).to.equal(1, 'The count of table elements')
        const table = tableList[0]
        expect(table.children.length).to.equal(1, 'The count of table children elements')
        const tbody = tableList[0].children[0]
        expect(tbody.children.length).to.be.eql(9, 'The count of element results')
    })

    it('Access all elements', () => {
        const file = readFileSync(`${process.cwd()}${path.sep}tests${path.sep}samples${path.sep}1.html`)
        const html = new HTMLParser(file.toString());
        const { elements } = html;
        expect(Object.keys(elements).length).to.equal(9, 'The count of existing element types')
        expect(elements['TR'].length).to.equal(9, 'The count of TR elements')
        expect(elements['TD'].length).to.equal(9, 'The count of TR elements')
    })
    it('Access document functions', () => {
        const file = readFileSync(`${process.cwd()}${path.sep}tests${path.sep}samples${path.sep}1.html`)
        const html = new HTMLParser(file.toString());
        const elements = html.document.querySelectorAll('tr[class=my-tr-is-the-best]')
        expect(elements.length).to.equal(1, 'The count of tr elements')
    })
});