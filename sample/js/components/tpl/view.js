export default $f.esc`

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


`