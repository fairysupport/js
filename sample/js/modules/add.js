import Base from '../parent.js';

export default class extends Base {

	obj1
	obj2
	dataList

	objCnt = 1;
	listCnt = 1;

    constructor() {
		super();
    }

    afterBindObj(data) {
    	super.afterBindObj(data);
    	this.objCnt++;
    }

    afterBindList(data) {
    	super.afterBindList(data);
    	this.listCnt++;
    }

    consoleLogClick(event) {
        console.log("sampleClick");
        console.log(this.obj2.textContent);
        this.dataList.forEach(item => console.log(item.textContent));
    }

    addObjClick(event) {
    	var divObj = document.createElement("DIV");
    	divObj.appendChild(document.createTextNode('obj' + this.objCnt));
    	divObj.dataset.obj = 'obj' + this.objCnt;
    	this.obj2.appendChild(divObj);
    }

    addListClick(event) {
    	var divObj = document.createElement("DIV");
    	divObj.appendChild(document.createTextNode('list' + this.listCnt));
    	divObj.dataset.list = 'dataList';
    	this.obj2.appendChild(divObj);
    }

}