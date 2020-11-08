import Base from '../../parent.js';

export default class extends Base {

    bind1
    bind2

    obj
    list
    dataList

    objCnt = 1;
    listCnt = 1;

    constructor() {
        super();
    }

    afterBindObj(data) {
        super.afterBindObj(data);
        if (data.name.indexOf('obj') === 0 && data.name.length > 3) {
            this.objCnt++;
        }
    }

    afterBindList(data) {
        super.afterBindList(data);
        if (data.name === 'dataList') {
            this.listCnt++;
        }
    }

    logClick(event) {
        console.log(this.bind1.textContent);
        for (let value of this.bind2.values()) {
            console.log(value.textContent);
        }
    }

    consoleLogClick(event) {
        for (let i = 1 ; i < this.objCnt; i++) {
            console.log(this['obj' + i].textContent);
        }
        for (let value of this.dataList.values()) {
            console.log(value.textContent);
        }
    }

    addObjClick(event) {
        var divObj = document.createElement("DIV");
        divObj.appendChild(document.createTextNode('obj' + this.objCnt));
        divObj.dataset.sampleObj = 'obj' + this.objCnt;
        this.obj.appendChild(divObj);
    }

    addListClick(event) {
        var divObj = document.createElement("DIV");
        divObj.appendChild(document.createTextNode('list' + this.listCnt));
        divObj.dataset.sampleList = 'dataList';
        this.list.appendChild(divObj);
    }

}