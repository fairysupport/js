import Base from '../parent.js';

export default class extends Base {

    constructor() {
        super();
        this.bind1 = null;
        this.bind2 = null;
    }

    logClick(event) {
        console.log(this.bind1.textContent);
        this.bind2.forEach(item => console.log(item.textContent));
    }

}