import { HTML } from "../src/html";
import { readFileSync } from 'fs';
import path = require("path");
import { expect } from "chai";
describe('HTML Scrapping', async function() {
    it('getElement function', () => {
        const file = readFileSync(`${process.cwd()}${path.sep}tests${path.sep}samples${path.sep}file.html`)
        const html = new HTML(file.toString());
        console.log(html.elements)
        //const elements = html.getElements('table');
        //expect(elements[0].childs.tr.length).to.be.eql(9, 'The count of element results')
    })
});