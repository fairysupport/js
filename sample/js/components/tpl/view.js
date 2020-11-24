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

`