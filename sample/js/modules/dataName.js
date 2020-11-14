import Base from '../parent.js';

export default class extends Base {

    constructor() {
        super();
    }

    dataName1_click(event) {
        console.log('dataName1_click ' + event.target.tagName);
    }

    dataName2_click(event) {
        console.log('dataName2_click ' + event.target.tagName);
    }

    dataName2_keyup(event) {
        console.log('dataName2_keyup ' + event.target.tagName + ' ' + event.key);
    }

    dataName3_click(event) {
        console.log('dataName3_click ' + event.target.tagName);
    }

    dataName3_mouseover(event) {
        console.log('dataName3_mouseover ' + event.target.tagName);
    }

}