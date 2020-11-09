import Base from '../parent.js';

export default class extends Base {

    dataObj;
    dataList;

    objCnt = 1;
    listCnt = 2;

    constructor() {
        super();
    }

    logClick(event) {
        console.log(this.dataObj.textContent);
        for (let value of this.dataList.values()) {
            console.log(value.textContent);
        }
    }

    replaceObjClick(event) {
        this.objCnt++;
        var divObj = document.createElement("DIV");
        divObj.textContent = 'div' + this.objCnt;
        divObj.dataset.obj = 'dataObj';
        this.dataObj = divObj;
    }

    replaceListClick(event) {
        this.listCnt++;
        var liObj = document.createElement("LI");
        liObj.textContent = 'dataList' + this.listCnt;
        liObj.dataset.list = 'dataList';
        for (let value of this.dataList.values()) {
            this.dataList.replace(value, liObj);
            break;
        }
    }

}