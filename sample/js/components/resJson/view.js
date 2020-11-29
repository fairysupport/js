export default $f.esc`
    <div data-res-json-obj='obj1'>${'v.data.key1'}</div>
    <div data-res-json-obj='obj2'>${'v["data"]["key2"]'}</div>
    <div data-res-json-obj='obj3' data-text='v.data.key3'></div>

    <hr size="1" width="100%">

    <div  data-res-json-list='dataList' data-foreach='v.data' data-foreach-key='arrKey' data-foreach-value='arrVal'>
        <span data-text='l.arrKey'></span>
        <span>:</span>
        <span data-text='l.arrVal'></span>
    </div>


    <button data-res-json-name="log">console</button>
`