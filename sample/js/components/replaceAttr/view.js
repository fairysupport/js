export default `
    <div data-replace-attr-obj="dataObj">div</div>
    <ol>
        <li data-replace-attr-list="dataList">dataList</li>
        <li data-replace-attr-list="dataList">dataList</li>
    </ol>

    <div data-replace-attr-obj="replace1">
        <div data-replace-attr-obj="replace2">
            <div data-replace-attr-obj="replace3">data-obj</div>
        </div>
    </div>

    <div data-replace-attr-list="replaceList">
        <div data-replace-attr-list="replaceList">
            <div data-replace-attr-list="replaceList">data-list</div>
        </div>
    </div>

    <button data-replace-attr-name="log" data-replace-attr-obj="log">output to console</button>
    <button data-replace-attr-name="replaceObj">replaceObj</button>
    <button data-replace-attr-name="replaceList">replaceList</button>
    <button data-replace-attr-name="replaceDataObj">replace data-obj</button>
    <button data-replace-attr-name="replaceDataList">replace data-list</button>
    <button data-replace-attr-name="replaceLog">replace data-name</button>
`