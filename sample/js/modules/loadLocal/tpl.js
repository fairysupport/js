import Base from '../../parent.js';

export default class extends Base {

    constructor() {
        super();
        this.div1 = null;
        this.div2 = null;
        this.div3 = null;
    }

    beforeLoadComponent_click(event) {
        $f.beforeLoadComponent(this.div1, 'tpl', {'parent': {'val1': 1, 'val2': 50}}, () => {console.log('beforeLoadComponent_click')});
    }

    afterLoadComponent_click(event) {
        $f.afterLoadComponent(this.div2, 'tpl', {'parent': {'val1': 2, 'val2': 20}}, () => {console.log('afterLoadComponent_click')});
    }

    childLoadComponent_click(event) {
        $f.loadComponent(this.div3, 'tpl', {'parent': {'val1': 5, 'val2': 10}}, () => {console.log('childLoadComponent_click')});
    }

}