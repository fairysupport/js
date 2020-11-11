import Base from '../parent.js';

export default class extends Base {

    constructor() {
        super();
        this.div1 = null;
        this.div2 = null;
        this.objCnt = 1;
    }

    logClick(event) {
        for (let i = 1; i <= this.div1.childNodes.length; i++) {
            console.log(this['obj' + i].textContent);
        }
        if (this.dataList) {
            this.dataList.forEach(item => console.log(item.textContent));
        }
    }

    addObjClick(event) {
        var divObj = document.createElement("DIV");
        divObj.textContent = 'obj' + this.objCnt;
        divObj.dataset.obj = 'obj' + this.objCnt;
        this.div1.appendChild(divObj);
        this.objCnt++;
    }

    addListClick(event) {
        var divObj = document.createElement("DIV");
        divObj.textContent = 'dataList';
        divObj.dataset.list = 'dataList';
        this.div2.appendChild(divObj);
    }

    add1Click(event) {
        this.obj1.innerHTML = '<div data-obj="obj2"><div data-obj="obj13">add data-obj</div></div>';
    }

    add2Click(event) {
        for (let value of this.list.values()) {
            value.innerHTML = '<div data-list="list"><div data-list="list">add data-list</div></div>';
            break;
        }
    }

}