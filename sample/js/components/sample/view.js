export default `
    <div data-sample-obj="bind1">This object is bound to bind1 of /js/components/sample/controller.js</div>
    <ol>
        <li data-sample-list="bind2">This object is bound to bind2 of /js/components/sample/controller.js</li>
        <li data-sample-list="bind2">This object is bound to bind2 of /js/components/sample/controller.js</li>
    </ol>
    <div data-sample-name="log">This object is bound to log[Evevt] of /js/components/sample/controller.js</div>


    <div data-sample-obj="obj"></div>
    <ol data-sample-obj="list">
        <li data-sample-list="dataList">list1</li>
        <li data-sample-list="dataList">list2</li>
    </ol>

    <div data-sample-name="consoleLog">output obj1 and obj2 to console</div>
    <div data-sample-name="addObj">add new DIV with data-name objX in obj</div>
    <div data-sample-name="addList">add new DIV with data-name dataList in list</div>
`