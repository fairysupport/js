import Base from '../../parent.js';

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
        console.log('component dataName_click');
    }

    addObj_click(event) {
        var divObj = document.createElement("DIV");
        divObj.textContent = 'component obj' + this.objCnt;
        divObj.dataset.addObj = 'obj' + this.objCnt;
        this.div1.appendChild(divObj);
        this.objCnt++;
    }

    addList_click(event) {
        var divObj = document.createElement("DIV");
        divObj.textContent = 'component dataList';
        divObj.dataset.addList = 'dataList';
        this.div2.appendChild(divObj);
    }

    addName_click(event) {
        var divObj = document.createElement("BUTTON");
        divObj.textContent = 'dataName';
        divObj.dataset.addName = 'dataName';
        this.div3.appendChild(divObj);
    }

    add1_click(event) {
        this.a.innerHTML = '<div data-add-obj="a2"><div data-add-obj="a3">add data-add-obj</div></div>';
    }

    add2_click(event) {
        for (let value of this.b.values()) {
            value.innerHTML = '<div data-add-list="b"><div data-add-list="b">add data-list</div></div>';
            break;
        }
    }

}