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
            if (this['obj' + i]) {
                console.log(this['obj' + i].textContent);
            }
        }
        this.dataList.forEach(item => console.log(item.textContent));
    }

    removeObj1Click(event) {
        if (this.obj1) {
            this.obj1.parentNode.removeChild(this.obj1);
        }
    }

    removeDataListClick(event) {
        for(let value of this.dataList){
            value.parentNode.removeChild(value);
            break;
        }
    }

    removeObj3Click(event) {
        if (this.obj3) {
            this.obj3.innerHTML = '';
        }
    }

    removeObj7Click(event) {
        if (this.obj7) {
            this.obj7.parentNode.removeChild(this.obj7);
        }
    }

}