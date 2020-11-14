export default `
    <div>div1</div>
    <div data-add-obj="div1" class="border"></div>
    <div>div2</div>
    <div data-add-obj="div2" class="border"></div>
    <div>div3</div>
    <div data-add-obj="div3" class="border"></div>

    <div data-add-obj="a">
    </div>

    <div data-add-list="b">
    </div>

    <button data-add-name="log">output content of component to console</button>
    <button data-add-name="addObj">add new DIV with data-obj objX in div1 of component</button>
    <button data-add-name="addList">add new DIV with data-list dataList in div2 of component</button>
    <button data-add-name="addName">add new DIV with data-name dataList in div3 of component</button>
    <button data-add-name="add1">add data-obj</button>
    <button data-add-name="add2">add data-list</button>
`