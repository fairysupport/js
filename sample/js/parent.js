export default class {

    constructor() {
    }

    init(data) {
        console.log("init");
        console.log(data);
    }

    beforeBindObj(data) {
        console.log("beforeBindObj");
        console.log(data);
    }
    afterBindObj(data) {
        console.log("afterBindObj");
        console.log(data);
    }

    beforeBindList(data) {
        console.log("beforeBindList");
        console.log(data);
    }
    afterBindList(data) {
        console.log("afterBindList");
        console.log(data);
    }

    beforeName(data) {
        console.log("beforeName");
        console.log(data);
    }
    afterName(data) {
        console.log("afterName");
        console.log(data);
    }

    beforeRemoveObj(data) {
        console.log("beforeRemoveObj");
        console.log(data);
    }
    afterRemoveObj(data) {
        console.log("afterRemoveObj");
        console.log(data);
    }

    beforeRemoveList(data) {
        console.log("beforeRemoveList");
        console.log(data);
    }
    afterRemoveList(data) {
        console.log("afterRemoveList");
        console.log(data);
    }

    beforeRemoveName(data) {
        console.log("beforeRemoveName");
        console.log(data);
    }
    afterRemoveName(data) {
        console.log("afterRemoveName");
        console.log(data);
    }

}