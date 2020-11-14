import Base from '../../parent.js';

export default class extends Base {

    constructor() {
        super();
        this.div1 = null;
        this.div2 = null;
        this.div3 = null;
        this.objCnt = 1;
    }

    log_click(event) {
        for (let i = 1; i <= this.div1.childNodes.length; i++) {
            console.log(this['obj' + i].textContent);
        }
        if (this.dataList) {
            this.dataList.forEach(item => console.log(item.textContent));
        }
    }

    dataName_click(event) {
        console.log('dataName_click');
    }

    addObj_click(event) {
        var divObj = document.createElement("DIV");
        divObj.textContent = 'obj' + this.objCnt;
        divObj.dataset.obj = 'obj' + this.objCnt;
        this.div1.appendChild(divObj);
        this.objCnt++;
    }

    addList_click(event) {
        var divObj = document.createElement("DIV");
        divObj.textContent = 'dataList';
        divObj.dataset.list = 'dataList';
        this.div2.appendChild(divObj);
    }

    addName_click(event) {
        var divObj = document.createElement("BUTTON");
        divObj.textContent = 'dataName';
        divObj.dataset.name = 'dataName';
        this.div3.appendChild(divObj);
    }

    loadComponent_click(event) {
        $f.loadComponent(this.div4, 'add', {'key1': 'value1', 'key2': 'value2'});
    }

    removeComponent_click(event) {
        this.div3.innerHTML = '';
    }

}