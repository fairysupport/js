import Base from '../../parent.js';

export default class extends Base {

    constructor() {
        super();
        this.div1 = null;
        this.div2 = null;
        this.div3 = null;
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

    loadComponentClick(event) {
        $f.loadComponent(this.div3, 'add', {'key1': 'value1', 'key2': 'value2'});
    }

    removeComponentClick(event) {
        this.div3.innerHTML = '';
    }

}