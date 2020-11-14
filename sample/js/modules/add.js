import Base from '../parent.js';

export default class extends Base {

    constructor() {
        super();
        this.div1 = null;
        this.div2 = null;
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
        let divObj = document.createElement("DIV");
        divObj.textContent = 'obj' + this.objCnt;
        divObj.dataset.obj = 'obj' + this.objCnt;
        this.div1.appendChild(divObj);
        this.objCnt++;
    }

    addList_click(event) {
        let divObj = document.createElement("DIV");
        divObj.textContent = 'dataList';
        divObj.dataset.list = 'dataList';
        this.div2.appendChild(divObj);
    }

    addName_click(event) {
        let divObj = document.createElement("BUTTON");
        divObj.textContent = 'dataName';
        divObj.dataset.name = 'dataName';
        this.div3.appendChild(divObj);
    }

    add1_click(event) {
        this.a.innerHTML = '<div data-obj="a2"><div data-obj="a3">add data-obj</div></div>';
    }

    add2_click(event) {
        for (let value of this.b.values()) {
            value.innerHTML = '<div data-list="b"><div data-list="b">add data-list</div></div>';
            break;
        }
    }

}