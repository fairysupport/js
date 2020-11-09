import Base from '../parent.js';

export default class extends Base {

    div1;
    div2;

    objCnt = 1;

    constructor() {
        super();
    }

    logClick(event) {
        for (let i = 1; i <= this.div1.childNodes.length; i++) {
            console.log(this['obj' + i].textContent);
        }
        if (this.dataList) {
            for (let value of this.dataList.values()) {
                console.log(value.textContent);
            }
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

}