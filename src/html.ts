export class HTML {
    elements: {[key: string]: any} = {}
    constructor(private html: string) {
        this.scrape();
    }

    /**
     * Scrapping the elements from the given HTML
     * @returns The instance of this object
     */
    private scrape(): this {
        let html = this.pritifyHtml(this.html);
        const htmlStartOpeningTag = '<body>';
        const htmlStartClosingTag = '</body>';
        const htmlStartIndex = html.indexOf(htmlStartOpeningTag) + htmlStartOpeningTag.length;
        const htmlEndIndex = html.indexOf(htmlStartClosingTag);
        html = html.slice(htmlStartIndex, htmlEndIndex);
        //As long as there is an element in general;
        while(html.indexOf('<') > -1) {
            const elementSigStartIndex = html.indexOf('<');
            let elementSigEndIndex = html.indexOf('>');
            const elementSignature = html.slice(elementSigStartIndex, elementSigEndIndex+1);
            const elementProperties = elementSignature.split(' ');
            
            let elementName = elementProperties[0];
            const isClosingElementTag = elementName.indexOf('</') > -1;
            elementName = elementName.replace('<', '').replace('</', '').replace('>', '');
            if(!isClosingElementTag && supportedElements.indexOf(elementName) > -1) {
                const elementObj: Element = {
                    name: elementName
                }
                this.updateElementProperties(elementProperties.slice(1).join(' '), elementObj);
                const cutHtml = html.slice(elementSigEndIndex+1);
                let closingTagStartIndex = cutHtml.indexOf(`</${elementName}>`);
                const openingTagStartIndex = cutHtml.indexOf(`<${elementName}`);
                //if this tag has a closing and it does not have another tag in the html of this kind.
                if(openingTagStartIndex === -1 && closingTagStartIndex > -1) {
                    const content = cutHtml.slice(0, closingTagStartIndex);
                    elementObj.content = content.replace(/\\t/g, '').trim();
                    elementObj.childs = this.scrapeElementsFromHtml(elementObj.content);
                    elementSigEndIndex = closingTagStartIndex
                }
                else if(openingTagStartIndex > -1 && closingTagStartIndex > -1 && closingTagStartIndex < openingTagStartIndex) {
                    const content = cutHtml.slice(0, closingTagStartIndex);
                    elementObj.content = content.replace(/\\t/g, '').trim();
                    elementObj.childs = this.scrapeElementsFromHtml(elementObj.content);
                    elementSigEndIndex = closingTagStartIndex
                }
                else {
                    elementObj.content = null;
                    elementObj.childs = null;
                }
                this.addElement(elementObj);
            }
            html = html.slice(elementSigEndIndex+1);
        }
        return this;
    }

    /**
     * Scrapping Elements from HTML
     * @param givenHtml The given HTML
     * @returns A list of elements
     */
    private scrapeElementsFromHtml(givenHtml: string): {[key: string]: Element[]} {
        let html = this.pritifyHtml(givenHtml);
        const elementsObj = {};
        //As long as there is an element in general;
        while(html.indexOf('<') > -1) {
            const elementSigStartIndex = html.indexOf('<');
            let elementSigEndIndex = html.indexOf('>');
            const elementSignature = html.slice(elementSigStartIndex, elementSigEndIndex+1);
            const elementProperties = elementSignature.split(' ');
            
            const elementName = elementProperties[0].replace('<', '').replace('>', '');
            if(!elementName.startsWith('</') && supportedElements.indexOf(elementName) > -1) {
                const elementObj: Element = {
                    name: elementName
                }
                this.updateElementProperties(elementProperties.slice(1).join(' '), elementObj);
                const cutHtml = html.slice(elementSigEndIndex+1);
                let closingTagStartIndex = cutHtml.indexOf(`</${elementName}>`);
                const openingTagStartIndex = cutHtml.indexOf(`<${elementName}`);
                //if this tag has a closing and it does not have another tag in the html of this kind.
                if(openingTagStartIndex === -1 && closingTagStartIndex > -1) {
                    const content = cutHtml.slice(0, closingTagStartIndex);
                    elementObj.content = content.replace(/\\t/g, '').trim();
                    elementObj.childs = this.scrapeElementsFromHtml(elementObj.content);
                    elementSigEndIndex = closingTagStartIndex
                }
                else if(openingTagStartIndex > -1 && closingTagStartIndex > -1 && closingTagStartIndex < openingTagStartIndex) {
                    const content = cutHtml.slice(0, closingTagStartIndex);
                    elementObj.content = content.replace(/\\t/g, '').trim();
                    elementObj.childs = this.scrapeElementsFromHtml(elementObj.content);
                    elementSigEndIndex = closingTagStartIndex
                }
                else {
                    elementObj.content = null;
                    elementObj.childs = null;
                }
                this.addElementToObj(elementObj, elementsObj);
            }
            html = html.slice(elementSigEndIndex+1);
        }
        return elementsObj;
    }

    /**
     * Pritifying HTML
     * @param html The html to pritify
     * @returns Pritified HTML
     */
    private pritifyHtml(html: string): string {
        return html
            .replace(/\\n/g, '').replace(/\\t/g, '').replace(/\\r/g, '')
            .replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '')
            .replace(/\s\s+/g, ' ');
    }

    /**
     * Updating the element properties inside a given obj
     * @param html The html of the element
     * @param elementObject The element object
     */
    private updateElementProperties(html: string, elementObject: Element): void {
        const endOfPropertyHtmlIndex = html.indexOf('>')
        let elementHtml = html.slice(0, endOfPropertyHtmlIndex+1);
        for(const p of supportedPropertiesWithValue){
            const propertyStartValue = `${p}=`;
            const propertyExists = elementHtml && elementHtml !== '' ? elementHtml.indexOf(propertyStartValue) > -1: false;
            if(propertyExists){
                let valueStartIndex = elementHtml.indexOf(propertyStartValue) + propertyStartValue.length;
                let propertyHtml = elementHtml.slice(valueStartIndex-1);
                const startOfPropertyValue = '="';
                const startOfPropertyIndex = propertyHtml.indexOf(startOfPropertyValue);
                propertyHtml = propertyHtml.slice(startOfPropertyIndex + startOfPropertyValue.length);
                const endOfPropertyValue1='" ';
                const endOfPropertyValue2 = '">';
                const endOfPropertyValue3 = '"';
                const endOfPropertyIndex1 = propertyHtml.indexOf(endOfPropertyValue1);
                const endOfPropertyIndex2 = propertyHtml.indexOf(endOfPropertyValue2);
                const endOfPropertyIndex3 = propertyHtml.indexOf(endOfPropertyValue3);
                const endOfPropertyIndex = endOfPropertyIndex1 > -1 && endOfPropertyIndex2 > -1 ?
                    Math.min(endOfPropertyIndex1, endOfPropertyIndex2): endOfPropertyIndex2 === -1 && endOfPropertyIndex1 > -1 ? 
                    endOfPropertyIndex1: endOfPropertyIndex3;
                const value = propertyHtml.slice(0, endOfPropertyIndex);
                elementObject[p] = value;
            }
        }
        for(const p of supportedPropertiesWithoutValue) {
            const propertyExists = elementHtml && elementHtml !== '' ? elementHtml.indexOf(p) > -1: false;
            if(propertyExists){
                elementObject[p] = true;
            }
        }
    }

    /**
     * Adding an element to an object
     * @param el The element to update with
     * @param obj The object to update
     */
    private addElementToObj(el: Element, obj: {[key: string]: any}): void {
        const {name, ...rest} = el;
        if(!obj[name]) {
            obj[name] = [];
        }
        
        obj[name].push(rest);
    }

    /**
     * Adding an elements to the elements list
     * @param el The element object
     */
    private addElement(el: Element) {
        const {name, ...rest} = el;
        if(!this.elements[name]) {
            this.elements[name] = [];
        }
        
        this.elements[name].push(rest);
    }

    /**
     * Retrieving elements from the list of elements by filter
     * @param element The name of the element. The actual type, i.e. "h1"
     * @param properties A list of element properties to filter by. Default: [] (empty array)
     * @returns A list of elements
     */
    getElements(element: string, properties: Property[] = []): Element[] {
        let elements: Element[] = this.elements[element] ?? [];
        for(const p of properties) {
            elements = elements.filter(element => element[p.name] === p.value);
        }
        return elements;
    }
}

/**
 * The available property names / types
 */
export type PropertyName = 'id' | 'class' | 'data-testid' | string

/**
 * The property object
 * @param name The name of the property. i.e. "id"
 * @param value The value of the property
 */
export type Property = {
    name: PropertyName,
    value: any
}

/**
 * The element object
 * @param name The name of the element. i.e. "h1"
 * @param id The id property of the element
 * @param class The class name of the element
 * @param content The content between the opening and closing brackets.
 */
export type Element = {
    name: string,
    content?: string,
    id?: string
    class?: string,
    [key: string]: any
}

/**
 * The supported elements of the scrapper
 */
export const supportedElements = ['table', 'h1', 'tr', 'td', 'input', 'select', 'option', 'div', 'a'];

/**
 * The supported properties that have an '=' sign
 */
export const supportedPropertiesWithValue = ['type', 'value', 'id', 'class'];

/**
 * The supported properties that don't have an '=' sign
 */
export const supportedPropertiesWithoutValue = ['checked', 'selected']