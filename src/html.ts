export class HTML {
    elements: {[key: string]: any} = {}
    constructor(private html: string) {
        this.scrap();
    }

    /**
     * Scrapping the elements from the given HTML
     * @returns The instance of this object
     */
    private scrap(): this {
        let html = this.html;
        //As long as there is an element in general;
        while(html.indexOf('<') > -1) {
            const elementSigStartIndex = html.indexOf('<');
            const elementSigEndIndex = html.indexOf('>');
            const elementSignature = html.slice(elementSigStartIndex, elementSigEndIndex+1);
            const elementProperties = elementSignature.split(' ');
            
            const elementName = elementProperties[0];
            if(!elementName.startsWith('</')) {
                const elementObj = {
                    name: elementName.replace('<', '').replace('>', '')
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
                this.addElement(elementObj);
            }
            html = html.slice(elementSigEndIndex+1);
        }
        return this
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
 */
export type Element = {
    name: string,
    id?: string
    class?: string,
    [key: string]: any
}