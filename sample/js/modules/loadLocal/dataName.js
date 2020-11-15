import Base from '../../parent.js';

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

    replace1_click(event) {
        let divObj = document.createElement("DIV");
        divObj.textContent = 'dataName1, dataName3';
        divObj.dataset.name = 'dataName1, dataName3';
        divObj.dataset.obj = 'dataName1';
        this.dataName1 = divObj;
    }

    replace2_click(event) {
        this.dataName2.value = 'dataName3';
        this.dataName2.dataset.name = 'dataName3';
    }

    remove1_click(event) {
        delete this.dataName3.dataset.name;
    }

    remove2_click(event) {
        this.dataName4 = null;
    }

    replace3_click(event) {
        this.dataName5.outerHTML = '<button data-obj="dataName5" data-name="dataName3">dataName3</button>';
    }

    replace4_click(event) {
        this.dataName6.outerHTML = '<button >remove</button>';
    }

    add1_click(event) {
        let divObj = document.createElement("DIV");
        divObj.textContent = 'dataName2,dataName3';
        divObj.dataset.name = 'dataName2,dataName3';
        this.dataName7.appendChild(divObj);
    }

    add2_click(event) {
        this.dataName8.innerHTML = '<div data-name="dataName1">dataName1</div>';
    }

    loadComponent_click(event) {
        $f.loadComponent(this.div, 'dataName', {'key1': 'value1', 'key2': 'value2'});
    }

    removeComponent_click(event) {
        this.div.innerHTML = '';
    }

}