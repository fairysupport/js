export default `
    <div data-remove-obj="bind1">This object is bound to bind1 of /js/components/remove/controller.js</div>
    <ol>
        <li data-remove-list="bind2">This object is bound to bind2 of /js/components/remove/controller.js</li>
        <li data-remove-list="bind2">This object is bound to bind2 of /js/components/remove/controller.js</li>
    </ol>

    <div data-remove-obj="removeObj1">
        <div data-remove-obj="removeObj2">
            <div data-remove-obj="removeObj3">removeObj</div>
        </div>
    </div>

    <div data-remove-list="removeList">
        <div data-remove-list="removeList">
            <div data-remove-list="removeList">removeList</div>
        </div>
    </div>

    <button data-remove-name="log">output content of component to console</button>
    <button data-remove-name="removeBind1">remove bind1 of component</button>
    <button data-remove-name="removeBind2">remove bind2 of component</button>
    <button data-remove-name="removeBind3">remove removeObj</button>
    <button data-remove-name="removeBind4">remove removeList</button>
`