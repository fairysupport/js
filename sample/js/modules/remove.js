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
        for (let value of this.dataList.values()) {
            console.log(value.textContent);
        }
    }

    removeObj1Click(event) {
        this.obj1 = null;
    }

    removeDataListClick(event) {
        for (let value of this.dataList.values()) {
            this.dataList.remove(value);
            break;
        }
    }

    removeObj3Click(event) {
        if (this.obj3) {
            this.obj3.innerHTML = '';
        }
    }

    removeObj7Click(event) {
        this.obj7 = null;
    }

}