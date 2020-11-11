import Base from '../../parent.js';

export default class extends Base {

    constructor() {
        super();
        this.bind1 = null;
        this.bind2 = null;
    }

    logClick(event) {
        if (this.bind1){
            console.log(this.bind1.textContent);
        }
        this.bind2.forEach(item => console.log(item.textContent));
    }

    removeBind1Click(event) {
        this.bind1 = null;
    }

    removeBind2Click(event) {
        for (let value of this.bind2.values()) {
            this.bind2.remove(value);
            break;
        }
    }

    removeBind3Click(event) {
        this.removeObj1.innerHTML = "";
    }

    removeBind4Click(event) {
        for (let value of this.removeList.values()) {
            value.innerHTML = "";
            break;
        }
    }

}