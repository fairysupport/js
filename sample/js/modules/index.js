import Base from '../parent.js';

export default class extends Base {

    bind1
    bind2

    constructor() {
        super();
    }

    logClick(event) {
        console.log(this.bind1.textContent);
        for (let value of this.bind2.values()) {
            console.log(value.textContent);
        }
    }

}