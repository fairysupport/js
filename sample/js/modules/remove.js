import Base from '../parent.js';

export default class extends Base {

    bind1;
    bind2;

    constructor() {
        super();
    }

    logClick(event) {
        if (this.bind1){
            console.log(this.bind1.textContent);
        }
        for (let value of this.bind2.values()) {
            console.log(value.textContent);
        }
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

}