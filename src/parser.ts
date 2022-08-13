import {JSDOM} from 'jsdom'
export class HTMLParser {
    _elementsByType: {[key: string]: Element[]} = {}
    _parser: JSDOM
    constructor(html: string){
        this._parser = new JSDOM(html)
        this.parse()
    }

    get document() {
        return this._parser.window.document;
    }

    get elements() {
        return this._elementsByType;
    }
    
    private getAllElements() {
        const elements = this.document.getElementsByTagName('*')
        return elements;
    }

    private parseElementsByTagName() {
        const elements = this.getAllElements();
        for(const el of elements) {
            if(!this._elementsByType[el.tagName]) {
                this._elementsByType[el.tagName] = []
            }
            this._elementsByType[el.tagName].push(el)
        }
    }

    private parse() {
        this.parseElementsByTagName()
    }

    /**
     * Retrieving elements from the list of elements by filter
     * @param elementTagName The element tag name. The actual type, i.e. "h1"
     * @param elementProperties A list of element properties to filter by. Default: [] (empty array)
     * @returns A list of elements
     */
     getElements(elementTagName: string, elementProperties: ElementProperty[] = []): Element[] {
        let elements = this.elements[elementTagName.toUpperCase()] ?? [];
        for(const prop of elementProperties) {
            elements = elements.filter(el => el[prop.name] !== undefined && el[prop.name] == prop.value)
        }
        return elements;
    }
}

/**
 * The property object
 * @param name The name of the property. i.e. "id"
 * @param value The value of the property
 */
export type ElementProperty = {
    name: string,
    value: string | number
}