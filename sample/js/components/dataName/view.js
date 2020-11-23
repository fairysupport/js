export default $f.esc`
    <div data-data-name-obj="dataObj">div1</div>
    <ol>
        <li data-data-name-list="dataList">dataList1</li>
        <li data-data-name-list="dataList">dataList2</li>
    </ol>
    <div>dataName1<button data-data-name-obj="dataName1" data-data-name-name="dataName1">dataName1</button></div>
    <div>dataName2<input data-data-name-obj="dataName2" data-data-name-name="dataName1, dataName2" type="text" value="dataName1, dataName2(1)"></div>
    <div>dataName3<input data-data-name-obj="dataName3" data-data-name-name="dataName1, dataName2, dataName3" type="text" value="dataName1, dataName2, dataName3(1)"></div>
    <div>dataName4<button data-data-name-obj="dataName4" data-data-name-name="dataName1, dataName2">dataName1, dataName2(2)</button></div>

    <div data-data-name-obj="replace1">
        <div data-data-name-obj="replace2">
            <div data-data-name-obj="replace3"><button data-data-name-obj="dataName5" data-data-name-name="dataName1, dataName2">dataName1, dataName2(3)</button></div>
        </div>
    </div>

    <div data-data-name-list="replaceList">
        <div data-data-name-list="replaceList">
            <div data-data-name-list="replaceList"><button data-data-name-obj="dataName6" data-data-name-name="dataName1, dataName2, dataName3">dataName1, dataName2, dataName3(2)</button></div>
        </div>
    </div>

    <div data-data-name-obj="dataName7">dataName7</div>
    <div data-data-name-obj="dataName8">dataName8</div>

    <button data-data-name-name="replace1">replace dataName1</button>
    <button data-data-name-name="replace2">replace dataName2</button>
    <button data-data-name-name="remove1">remove dataName3</button>
    <button data-data-name-name="remove2">remove dataName4</button>
    <button data-data-name-name="replace3">replace dataName5</button>
    <button data-data-name-name="replace4">replace dataName6</button>
    <button data-data-name-name="add1">add dataName7</button>
    <button data-data-name-name="add2">add dataName8</button>

`