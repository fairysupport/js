import Base from '../../parent.js';

export default class extends Base {

    constructor() {
        super();
        this.dataObj = null;
        this.dataList = null;
        this.div = null;
        this.objCnt = 1;
        this.listCnt = 2;
    }

    log_click(event) {
        console.log(this.dataObj.textContent);
        this.dataList.forEach(item => console.log(item.textContent));
    }

    replaceObj_click(event) {
        this.objCnt++;
        var divObj = document.createElement("DIV");
        divObj.textContent = 'div' + this.objCnt;
        divObj.dataset.obj = 'dataObj';
        this.dataObj = divObj;
    }

    replaceList_click(event) {
        this.listCnt++;
        var liObj = document.createElement("LI");
        liObj.textContent = 'dataList' + this.listCnt;
        liObj.dataset.list = 'dataList';
        for (let value of this.dataList.values()) {
            this.dataList.replace(value, liObj);
            break;
        }
    }

    loadComponent_click(event) {
        $f.loadComponent(this.div, 'replace', {'key1': 'value1', 'key2': 'value2'});
    }

    removeComponent_click(event) {
        this.div.innerHTML = '';
    }

}