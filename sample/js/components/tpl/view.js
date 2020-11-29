export default $f.esc`

    <div data-attr='{"style": "color:white; background-color: black; ", "contenteditable" : true, "title" : "span1"}'>data-attr</div>
    <div data-js='l.attr = {"style": "color:red; background-color: blue;", "contenteditable" : true, "title" : "span1"}'></div>
    <div data-attr='l.attr'>data-attr</div>

    <div data-prop='{"style": {"color" : "white", "backgroundColor": "black"}, "contentEditable" : true, "title" : "span2", "dataset" : {"sample1": "val1", "sample2": "val2"}}'>data-prop</div>
    <div data-js='l.prop = {"dataset" : {"sample1": "val1", "sample2": "val2"}, "contentEditable" : true, "title" : "span2", "style": {"color" : "red", "backgroundColor": "blue"}}'></div>
    <div data-prop='l.prop'>data-prop</div>

    <div data-if='v.parent.val1 === 1'>
        <div>
            <span>1 v.parent.val1 === ${'v.parent.val1'}</span>
            <div>
                <div data-if='v.parent.val2 === 10'>
                    <span>10 v.parent.val2 === ${'v.parent.val2'}</span>
                </div>
                <div data-elseif='v.parent.val2 === 20'>
                    <span>20 v.parent.val2 === ${'v.parent.val2'}</span>
                </div>
                <div data-else=''>
                    <span>else v.parent.val2 === ${'v.parent.val2'}</span>
                </div>
            </div>
        </div>
    </div>
    <div data-elseif='v.parent.val1 === 2'>
        <div>
            <span>2 v.parent.val1 === ${'v.parent.val1'}</span>
            <div>
                <div data-if='v.parent.val2 === 10'>
                    <span>10 v.parent.val2 === ${'v.parent.val2'}</span>
                </div>
                <div data-elseif='v.parent.val2 === 20'>
                    <span>20 v.parent.val2 === ${'v.parent.val2'}</span>
                </div>
                <div data-else=''>
                    <span>else v.parent.val2 === ${'v.parent.val2'}</span>
                </div>
            </div>
        </div>
    </div>
    <div data-elseif='v.parent.val1 === 3'>
        <div>
            <span>3 v.parent.val1 === ${'v.parent.val1'}</span>
            <div>
                <div data-if='v.parent.val2 === 10'>
                    <span>10 v.parent.val2 === ${'v.parent.val2'}</span>
                </div>
                <div data-elseif='v.parent.val2 === 20'>
                    <span>20 v.parent.val2 === ${'v.parent.val2'}</span>
                </div>
                <div data-else=''>
                    <span>else v.parent.val2 === ${'v.parent.val2'}</span>
                </div>
            </div>
        </div>
    </div>
    <div data-else=''>
        <div>
            <span>else ${'v.parent.val1'}</span>
            <div>
                <div data-if='v.parent.val2 === 10'>
                    <span>10 v.parent.val2 === ${'v.parent.val2'}</span>
                </div>
                <div data-elseif='v.parent.val2 === 20'>
                    <span>20 v.parent.val2 === ${'v.parent.val2'}</span>
                </div>
                <div data-else=''>
                    <span>else v.parent.val2 === ${'v.parent.val2'}</span>
                </div>
            </div>
        </div>
    </div>

    <hr size="1" width="100%">

    <div data-for-start='l.i = 0' data-for-end='l.i < 10' data-for-step='l.i++'>
        <div data-if='l.i === 3'>
            <div data-continue='1'></div>
        </div>
        <div data-if='l.i === 6'>
            <div data-break='1'></div>
        </div>
        <div>
            <span>current value </span>
            <span data-text='l.i'></span>
        </div>
    </div>

    <hr size="1" width="100%">

    <div data-for-start='l.i = 0' data-for-end='l.i < 10' data-for-step='l.i++'>
        <span data-if='l.i === 3' data-continue='1' data-tag='hidden'></span>
        <span data-if='l.i === 6' data-break='1' data-tag='hidden'></span>
        <div>
            <span>current value </span>
            <span data-text='l.i'></span>
        </div>
    </div>

    <hr size="1" width="100%">

    <div data-for-start='l.i = 0' data-for-end='l.i < 2' data-for-step='l.i++'>
        <div>
            <span>current i </span>
            <span data-text='l.i'></span>
        </div>
        <div data-for-start='l.j = 0' data-for-end='l.j < 10' data-for-step='l.j++'>
            <span data-if='l.j === 3' data-continue='1' data-tag='hidden'></span>
            <div>
                <span>current j </span>
                <span data-text='l.j'></span>
            </div>
            <span data-if='l.j === 4' data-continue='2' data-tag='hidden'></span>
            <div>
                <span>end loop j </span>
                <span data-text='l.j'></span>
            </div>
        </div>
        <div>
            <span>loop end i </span>
            <span data-text='l.i'></span>
        </div>
    </div>

    <hr size="1" width="100%">

    <div data-for-start='l.i = 0' data-for-end='l.i < 5' data-for-step='l.i++'>
        <div>
            <span>current i </span>
            <span data-text='l.i'></span>
        </div>
        <div data-for-start='l.j = 0' data-for-end='l.j < 10' data-for-step='l.j++'>
            <span data-if='l.i === 2 && l.j === 3' data-break='1' data-tag='hidden'></span>
            <div>
                <span>current j </span>
                <span data-text='l.j'></span>
            </div>
            <span data-if='l.i === 3 && l.j === 4' data-break='2' data-tag='hidden'></span>
            <div>
                <span>end loop j </span>
                <span data-text='l.j'></span>
            </div>
        </div>
        <div>
            <span>loop end i </span>
            <span data-text='l.i'></span>
        </div>
    </div>

    <hr size="1" width="100%">

    <div data-js='l.var = {"key1": "str1", "key2": 2}'></div>
    <div data-text='l.var.key1 + "_add"'></div>
    <div data-js='l.var.key2++' data-text='l.var.key2'></div>



    <hr size="1" width="100%">

    <div data-js='l.arr = {"key1": "str1", "key2": "str2", "key3": "str3", "key4": "str4", "key5": "str5"}'></div>
    <div data-foreach='l.arr' data-foreach-key='arrKey' data-foreach-value='arrVal'>
        <span data-text='l.arrKey'></span>
        <span>:</span>
        <span data-text='l.arrVal'></span>
    </div>


    <hr size="1" width="100%">

    <div data-foreach='v.parent' data-foreach-key='arrKey' data-foreach-value='arrVal'>
        <span data-text='l.arrKey'></span>
        <span>:</span>
        <span data-text='l.arrVal'></span>
    </div>

    <hr size="1" width="100%">

    <div data-foreach='l.arr' data-foreach-key='arrKey' data-foreach-value='arrVal'>
        <div>
            <span data-text='l.arrKey'></span>
            <span>:</span>
            <span data-text='l.arrVal'></span>
        </div>
        <span data-if='l.arrKey === "key2"' data-continue='1' data-tag='hidden'></span>
        <span data-if='l.arrKey === "key3"' data-break='1' data-tag='hidden'></span>
        <div>
            <span>end loop </span>
            <span data-text='l.arrKey'></span>
            <span>:</span>
            <span data-text='l.arrVal'></span>
        </div>
    </div>

    <hr size="1" width="100%">

    <div data-js='l.arr2 = {"key10": "str10", "key20": "str20", "key30": "str30", "key40": "str40", "key50": "str50"}'></div>
    <div data-foreach='l.arr' data-foreach-key='arrKey' data-foreach-value='arrVal'>
        <div>
            <span>parent loop </span>
            <span data-text='l.arrKey'></span>
            <span>:</span>
            <span data-text='l.arrVal'></span>
        </div>
        <div data-foreach='l.arr2' data-foreach-key='arrKey2' data-foreach-value='arrVal2'>
            <span data-if='l.arrKey2 === "key20"' data-continue='1' data-tag='hidden'></span>
            <div>
                <span>child loop </span>
                <span data-text='l.arrKey2'></span>
                <span>:</span>
                <span data-text='l.arrVal2'></span>
            </div>
            <span data-if='l.arrKey2 === "key40"' data-continue='2' data-tag='hidden'></span>
            <div>
                <span>child end loop </span>
                <span data-text='l.arrKey2'></span>
                <span>:</span>
                <span data-text='l.arrVal2'></span>
            </div>
        </div>
        <div>
            <span>parent end loop </span>
            <span data-text='l.arrKey'></span>
            <span>:</span>
            <span data-text='l.arrVal'></span>
        </div>
    </div>



    <hr size="1" width="100%">

    <div data-foreach='l.arr' data-foreach-key='arrKey' data-foreach-value='arrVal'>
        <div>
            <span>parent loop </span>
            <span data-text='l.arrKey'></span>
            <span>:</span>
            <span data-text='l.arrVal'></span>
        </div>
        <div data-foreach='l.arr2' data-foreach-key='arrKey2' data-foreach-value='arrVal2'>
            <span data-if='l.arrKey === "key2" && l.arrKey2 === "key20"' data-break='1' data-tag='hidden'></span>
            <div>
                <span>child loop </span>
                <span data-text='l.arrKey2'></span>
                <span>:</span>
                <span data-text='l.arrVal2'></span>
            </div>
            <span data-if='l.arrKey === "key3" && l.arrKey2 === "key40"' data-break='2' data-tag='hidden'></span>
            <div>
                <span>child end loop </span>
                <span data-text='l.arrKey2'></span>
                <span>:</span>
                <span data-text='l.arrVal2'></span>
            </div>
        </div>
        <div>
            <span>parent end loop </span>
            <span data-text='l.arrKey'></span>
            <span>:</span>
            <span data-text='l.arrVal'></span>
        </div>
    </div>


    <hr size="1" width="100%">

    <div data-js='l.whileCount = -1'></div>
    <div data-while='l.whileCount < 3'>
        <div data-js='l.whileCount++'></div>
        <div>
            <span>parent loop </span>
            <span data-text='l.whileCount'></span>
        </div>
        <div data-js='l.whileChildCount = -1'></div>
        <div data-while='l.whileChildCount < 3'>
            <div data-js='l.whileChildCount++'></div>
            <span data-if='l.whileCount === 1 && l.whileChildCount === 1' data-continue='1' data-tag='hidden'></span>
            <div>
                <span>child loop </span>
                <span data-text='l.whileChildCount'></span>
            </div>
            <span data-if='l.whileCount === 2 && l.whileChildCount === 1' data-continue='2' data-tag='hidden'></span>
            <div>
                <span>child end loop </span>
                <span data-text='l.whileChildCount'></span>
            </div>
        </div>
        <div>
            <span>parent end loop </span>
            <span data-text='l.whileCount'></span>
        </div>
    </div>


    <hr size="1" width="100%">

    <div data-js='l.whileCount = -1'></div>
    <div data-while='l.whileCount < 3'>
        <div data-js='l.whileCount++'></div>
        <div>
            <span>parent loop </span>
            <span data-text='l.whileCount'></span>
        </div>
        <div data-js='l.whileChildCount = -1'></div>
        <div data-while='l.whileChildCount < 3'>
            <div data-js='l.whileChildCount++'></div>
            <span data-if='l.whileCount === 1 && l.whileChildCount === 1' data-break='1' data-tag='hidden'></span>
            <div>
                <span>child loop </span>
                <span data-text='l.whileChildCount'></span>
            </div>
            <span data-if='l.whileCount === 2 && l.whileChildCount === 1' data-break='2' data-tag='hidden'></span>
            <div>
                <span>child end loop </span>
                <span data-text='l.whileChildCount'></span>
            </div>
        </div>
        <div>
            <span>parent end loop </span>
            <span data-text='l.whileCount'></span>
        </div>
    </div>

    <div>end</div>

`