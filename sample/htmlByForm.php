<div data-res-html-by-form-obj='obj1'><?php echo htmlspecialchars($_POST["req1"], ENT_QUOTES);?></div>
<div data-res-html-by-form-obj='obj2'><?php echo htmlspecialchars(isset($_POST["req2"]) ? $_POST["req2"] : '', ENT_QUOTES);?></div>
<div data-res-html-by-form-obj='obj3'><?php echo htmlspecialchars($_POST["req3"][0], ENT_QUOTES);?></div>

<hr size="1" width="100%">

<?php foreach ($_POST as $k => $v) { ?>
    <div  data-res-html-by-form-list='dataList'>
        <span><?php echo htmlspecialchars($k, ENT_QUOTES);?></span>
        <span>:</span>
        <span><?php echo htmlspecialchars(var_export($v, true), ENT_QUOTES);?></span>
    </div>
<?php } ?>

<hr size="1" width="100%">

<div  data-res-html-by-form-list='localDataList' data-foreach='v' data-foreach-key='arrKey' data-foreach-value='arrVal'>
    <span data-text='l.arrKey'></span>
    <span>:</span>
    <span data-text='l.arrVal'></span>
</div>


<button data-res-html-by-form-name="log">console</button>

