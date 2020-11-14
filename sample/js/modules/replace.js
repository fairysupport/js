import Base from '../parent.js';

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

    dataName_click(event) {
        console.log('dataName');
    }

    dataName1_click(event) {
        console.log('dataName1');
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

    replaceName_click(event) {
        this.dataName.dataset.name = 'dataName1';
    }

    replaceDataObj_click(event) {
        this.replace1.innerHTML = '<div data-obj="replace4"><div data-obj="replace5">replace data-obj</div></div>';
    }

    replaceDataList_click(event) {
        for (let value of this.replaceList.values()) {
            value.innerHTML = '<div data-list="replaceList"><div data-list="replaceList">replace data-list</div></div>';
            break;
        }
    }

}