import Base from '../../parent.js';

export default class extends Base {

    constructor() {
        super();
        this.div1 = null;
        this.div2 = null;
        this.div3 = null;
    }

    beforeLoadComponent_click(event) {
        $f.beforeLoadComponent(this.div1, 'load', {'key1': 'before value1', 'key2': 'before value2'}, () => {console.log('beforeLoadComponent_click')});
    }

    afterLoadComponent_click(event) {
        $f.afterLoadComponent(this.div2, 'load', {'key1': 'after value1', 'key2': 'after value2'}, () => {console.log('afterLoadComponent_click')});
    }

    childLoadComponent_click(event) {
        $f.loadComponent(this.div3, 'load', {'key1': 'child value1', 'key2': 'child value2'}, () => {console.log('childLoadComponent_click')});
    }

}