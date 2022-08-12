class Tag {
    constructor(private html: string){}
    //We are expecting the html to contain a starting tag and ending tag and it's contents.
    //<table id='xx'>
    //Make sure to check if elements is a one line element.

    parse() {
        const elementName = this.html.split(' ')[0]
        
        //let cutHtml = this.html.split(' ')[1]
    }
}