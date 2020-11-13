import Base from '../../parent.js';

export default class extends Base {

    constructor() {
        super();
        this.dataObj = null;
        this.dataList = null;
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
        divObj.textContent = 'component div' + this.objCnt;
        divObj.dataset.replaceObj = 'dataObj';
        this.dataObj = divObj;
    }

    replaceList_click(event) {
        this.listCnt++;
        var liObj = document.createElement("LI");
        liObj.textContent = 'component dataList' + this.listCnt;
        liObj.dataset.replaceList = 'dataList';
        for (let value of this.dataList.values()) {
            this.dataList.replace(value, liObj);
            break;
        }
    }

    replaceDataObj_click(event) {
        this.replace1.innerHTML = '<div data-replace-obj="replace4"><div data-replace-obj="replace5">replace data-obj</div></div>';
    }

    replaceDataList_click(event) {
        for (let value of this.replaceList.values()) {
            value.innerHTML = '<div data-replace-list="replaceList"><div data-replace-list="replaceList">replace data-list</div></div>';
            break;
        }
    }

}