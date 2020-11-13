import Base from '../../parent.js';

export default class extends Base {

    constructor() {
        super();
        this.bind1 = null;
        this.bind2 = null;
        this.div = null;
    }

    log_click(event) {
        if (this.bind1){
            console.log(this.bind1.textContent);
        }
        this.bind2.forEach(item => console.log(item.textContent));
    }

    removeBind1_click(event) {
        this.bind1 = null;
    }

    removeBind2_click(event) {
        for (let value of this.bind2.values()) {
            this.bind2.remove(value);
            break;
        }
    }

    loadComponent_click(event) {
        $f.loadComponent(this.div, 'remove', {'key1': 'value1', 'key2': 'value2'});
    }

    removeComponent_click(event) {
        this.div.innerHTML = '';
    }

}