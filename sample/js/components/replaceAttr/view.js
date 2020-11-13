export default `
    <div data-replaceAttr-obj="dataObj">div</div>
    <ol>
        <li data-replaceAttr-list="dataList">dataList</li>
        <li data-replaceAttr-list="dataList">dataList</li>
    </ol>

    <div data-replaceAttr-obj="replace1">
        <div data-replaceAttr-obj="replace2">
            <div data-replaceAttr-obj="replace3">data-obj</div>
        </div>
    </div>

    <div data-replaceAttr-list="replaceList">
        <div data-replaceAttr-list="replaceList">
            <div data-replaceAttr-list="replaceList">data-list</div>
        </div>
    </div>

    <button data-replaceAttr-name="log" data-obj="log">output to console</button>
    <button data-replaceAttr-name="replaceObj">replaceObj</button>
    <button data-replaceAttr-name="replaceList">replaceList</button>
    <button data-replaceAttr-name="replaceDataObj">replace data-obj</button>
    <button data-replaceAttr-name="replaceDataList">replace data-list</button>
    <button data-replaceAttr-name="replaceLog">replace data-name</button>
`