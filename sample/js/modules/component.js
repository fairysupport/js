import Base from '../parent.js';

export default class extends Base {

    bind1

    constructor() {
        super();
    }

    loadSampleComponentClick(event) {
        $f.loadComponent(this.bind1, 'sample', {'key1': 'value1'});
    }

    removeSampleComponentClick(event) {
        this.bind1.innerHTML = '';
    }

}