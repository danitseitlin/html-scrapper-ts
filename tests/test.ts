import { HTML } from "../src/html";
import { readFileSync } from 'fs';
import path = require("path");
import { expect } from "chai";
describe('HTML Scrapping', async function() {
    it('getElement function', () => {
        const file = readFileSync(`${process.cwd()}${path.sep}tests${path.sep}samples${path.sep}1.html`)
        const html = new HTML(file.toString());
        const elements = html.getElements('tr', [{
            name: 'class',
            value: 'my-tr-is-special'
        }]);
        expect(elements.length).to.be.eql(9, 'The count of element results')
    })
});