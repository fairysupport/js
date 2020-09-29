import Base from '../parent.js';

export default class extends Base {

	bind1
	bind2

    constructor() {
		super();
    }

    logClick(event) {
        console.log(this.bind1.textContent);
        this.bind2.forEach(item => console.log(item.textContent));
    }

}