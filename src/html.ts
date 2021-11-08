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
        let html = this.html;
        const htmlStartIndex = html.indexOf('<body>');
        html = html.slice(htmlStartIndex);
        html = html
                .replace(/\\n/g, '').replace(/\\t/g, '').replace(/\\r/g, '')
                .replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '')
                .replace(/\s\s+/g, ' ');
        //As long as there is an element in general;
        while(html.indexOf('<') > -1) {
            const elementSigStartIndex = html.indexOf('<');
            const elementSigEndIndex = html.indexOf('>');
            const elementSignature = html.slice(elementSigStartIndex, elementSigEndIndex+1);
            const elementProperties = elementSignature.split(' ');
            
            const elementName = elementProperties[0].replace('<', '').replace('>', '');
            if(!elementName.startsWith('</') && supportedElements.indexOf(elementName) > -1) {
                const elementObj: Element = {
                    name: elementName
                }
                for(let i = 1; i < elementProperties.length; i++) {
                    const propertyItem = elementProperties[i];
                    if(propertyItem.indexOf('=') > -1) {
                        const splitProperty = propertyItem.split('=');
                        const propName = splitProperty[0];
                        let propValue = splitProperty[1].replace('>', '');
                        if(
                            (propValue.startsWith('"') && propValue.endsWith('"')) || 
                            (propValue.startsWith("'") && propValue.endsWith("'"))) 
                        {
                            propValue = propValue.slice(1, -1);
                        }
                        elementObj[propName] = propValue
                    }
                    else {
                        elementObj[propertyItem] = true
                    }
                }
                const cutHtml = html.slice(elementSigEndIndex+1);
                const closingTagStartIndex = cutHtml.indexOf(`</${elementName}>`);
                const openingTagStartIndex = cutHtml.indexOf(`<${elementName}`);
                //if this tag has a closing and it does not have another tag in the html of this kind.
                if(openingTagStartIndex === -1 && closingTagStartIndex > -1) {
                    const content = cutHtml.slice(0, closingTagStartIndex);
                    elementObj.content = content.replace(/\r?\n|\r/g, '').trim();
                    elementObj.childs = this.scrapeElementsFromHtml(elementObj.content);
                }
                else if(openingTagStartIndex > -1 && closingTagStartIndex > -1 && closingTagStartIndex < openingTagStartIndex) {
                    const content = cutHtml.slice(0, closingTagStartIndex);
                    elementObj.content = content.replace(/\r?\n|\r/g, '').trim();
                    elementObj.childs = this.scrapeElementsFromHtml(elementObj.content);
                }
                this.addElement(elementObj);
            }
            html = html.slice(elementSigEndIndex+1);
        }
        return this
    }

    /**
     * Scrapping Elements from HTML
     * @param givenHtml The given HTML
     * @returns A list of elements
     */
    private scrapeElementsFromHtml(givenHtml: string): {[key: string]: Element[]} {
        let html = givenHtml
                .replace(/\\n/g, '').replace(/\\t/g, '').replace(/\\r/g, '')
                .replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '')
                .replace(/\s\s+/g, ' ');
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
     * Updating the element properties inside a given obj
     * @param html The html of the element
     * @param elementObject The element object
     */
    private updateElementProperties(html: string, elementObject: Element): void {
        let cutHtml = html;
        for(const p of supportedPropertiesWithValue){
            const propertyStartValue = `${p}=`;
            const propertyExists = cutHtml && cutHtml !== '' ? cutHtml.indexOf(propertyStartValue) > -1: false;
            if(propertyExists){
                let valueStartIndex = cutHtml.indexOf(propertyStartValue) + propertyStartValue.length;
                cutHtml = cutHtml.slice(valueStartIndex);
                const firstQuotationMark = cutHtml.indexOf('"');
                cutHtml = cutHtml.slice(firstQuotationMark+1);
                const secondQuotationMark = cutHtml.indexOf('"');
                const value = cutHtml.slice(0, secondQuotationMark);
                cutHtml = cutHtml.slice(secondQuotationMark+1);
                elementObject[p] = value;
            }
        }
        for(const p of supportedPropertiesWithoutValue) {
            const propertyExists = cutHtml && cutHtml !== '' ? cutHtml.indexOf(p) > -1: false;
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
     * @param properties A list of element properties to filter by
     * @returns A list of elements
     */
    getElements(element: string, properties?: Property[]): Element[] {
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
export const supportedElements = ['h1','tr', 'td', 'input'];

/**
 * The supported properties that have an '=' sign
 */
export const supportedPropertiesWithValue = ['type', 'value', 'style', 'id'];

/**
 * The supported properties that don't have an '=' sign
 */
export const supportedPropertiesWithoutValue = ['checked']