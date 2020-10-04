import Base from '../parent.js';

export default class extends Base {

	obj1
	obj2
	obj3
    obj4
    obj5
    obj6
    obj7
    obj8
	dataList

    constructor() {
		super();
    }

    consoleLogClick(event) {
        for (let i = 1 ; i < 9; i++) {
        	console.log(this['obj' + i].textContent);
        }
        this.dataList.forEach(item => console.log(item.textContent));
    }

    removeObj1Click(event) {
        this.obj1.parentNode.removeChild(this.obj1);
    }

    removeDataListClick(event) {
        if (this.dataList.size > 0) {
            this.dataList[0].parentNode.removeChild(this.dataList[0]);
        }
    }

    removeObj3Click(event) {
        this.obj3.innerHTML = '';
    }

    removeObj7Click(event) {
        this.obj7.parentNode.removeChild(this.obj7);
    }

}