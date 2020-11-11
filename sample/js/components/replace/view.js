export default `
    <div data-replace-obj="dataObj">component div1</div>
    <ol>
        <li data-replace-list="dataList">component dataList1</li>
        <li data-replace-list="dataList">component dataList2</li>
    </ol>

    <div data-replace-obj="replace1">
        <div data-replace-obj="replace2">
            <div data-replace-obj="replace3">data-obj</div>
        </div>
    </div>

    <div data-replace-list="replaceList">
        <div data-replace-list="replaceList">
            <div data-replace-list="replaceList">data-list</div>
        </div>
    </div>

    <button data-replace-name="log">output content of component to console</button>
    <button data-replace-name="replaceObj">replaceObj of component</button>
    <button data-replace-name="replaceList">replaceList of component</button>
    <button data-replace-name="replaceDataObj">replace data-obj</button>
    <button data-replace-name="replaceDataList">replace data-list</button>
`