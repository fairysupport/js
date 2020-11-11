import Base from '../parent.js';

export default class extends Base {

    constructor() {
        super();
    }

    log_click(event) {
        console.log(this.dataObj ? this.dataObj.textContent : 'There is no dataObj');
        console.log(this.changeDataObj ? this.changeDataObj.textContent : 'There is no changeDataObj');
        if (this.dataList) {
            this.dataList.forEach(item => console.log(item.textContent));
        }
        if (this.changeDataList) {
            this.changeDataList.forEach(item => console.log(item.textContent));
        }

        console.log(this.replace1 ? this.replace1.textContent : 'There is no replace1');
        console.log(this.changeReplace1 ? this.changeReplace1.textContent : 'There is no changeReplace1');
        if (this.replaceList) {
            this.replaceList.forEach(item => console.log(item.textContent));
        }
        if (this.changeReplaceList) {
            this.changeReplaceList.forEach(item => console.log(item.textContent));
        }
    }

    log2_click(event) {
        console.log('click log2');
    }

    replaceObj_click(event) {
        if (this.dataObj) {
            this.dataObj.textContent = 'changeDataObj';
            this.dataObj.dataset.obj = 'changeDataObj';
        }
    }

    replaceList_click(event) {
        for (let value of this.dataList.values()) {
            value.textContent = 'changeDataList';
            value.dataset.list = 'changeDataList';
        }
    }

    replaceDataObj_click(event) {
        if (this.replace1) {
            this.replace1.outerHTML = '<div data-obj="changeReplace1"><div data-obj="changeReplace2"><div data-obj="changeReplace3">change replace data-obj</div></div></div>';
        }
    }

    replaceDataList_click(event) {
        for (let value of this.replaceList.values()) {
            value.outerHTML = '<div data-list="changeReplaceList"><div data-list="changeReplaceList"><div data-list="changeReplaceList">change replace data-list</div></div></div>';
            break;
        }
    }

    replaceLog_click(event) {
        this.log.dataset.name = 'log2';
    }

}