import Base from '../../parent.js';

export default class extends Base {

    constructor() {
        super();
    }

    log_click(event) {
        console.log(this.obj1);
        console.log(this.obj2);
        console.log(this.obj3);
        this.dataList.forEach(item => console.log(item.textContent));
        this.localDataList.forEach(item => console.log(item.textContent));
    }

}