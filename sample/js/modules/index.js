import Base from '../parent.js';

export default class extends Base {

	bind1
	bind2

    constructor() {
		super();
    }

    sampleClick(event) {
        console.log("sampleClick");
        console.log(this.bind1.textContent);
        this.bind2.forEach(item => console.log(item.textContent));
    }

}