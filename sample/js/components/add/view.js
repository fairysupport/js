export default `
    <div>div1</div>
    <div data-add-obj="div1" class="border"></div>
    <div>div2</div>
    <div data-add-obj="div2" class="border"></div>

    <div data-add-obj="obj1">
    </div>

    <div data-add-list="list">
    </div>

    <button data-add-name="log">output content of component to console</button>
    <button data-add-name="addObj">add new DIV with data-name objX in div1 of component</button>
    <button data-add-name="addList">add new DIV with data-name dataList in div2 of component</button>
    <button data-add-name="add1">add data-obj</button>
    <button data-add-name="add2">add data-list</button>
`