<?php
$req = json_decode(file_get_contents('php://input'), true);
?>

<div data-res-html-obj='obj1'><?php echo htmlspecialchars($req["req1"], ENT_QUOTES);?></div>
<div data-res-html-obj='obj2'><?php echo htmlspecialchars($req["req2"], ENT_QUOTES);?></div>
<div data-res-html-obj='obj3'><?php echo htmlspecialchars($req["req3"][0], ENT_QUOTES);?></div>

<hr size="1" width="100%">

<?php foreach ($req as $k => $v) { ?>
    <div  data-res-html-list='dataList'>
        <span><?php echo htmlspecialchars($k, ENT_QUOTES);?></span>
        <span>:</span>
        <span><?php echo htmlspecialchars(var_export($v, true), ENT_QUOTES);?></span>
    </div>
<?php } ?>

<hr size="1" width="100%">

<div  data-res-html-list='localDataList' data-foreach='v' data-foreach-key='arrKey' data-foreach-value='arrVal'>
    <span data-text='l.arrKey'></span>
    <span>:</span>
    <span data-text='l.arrVal'></span>
</div>


<button data-res-html-name="log">console</button>
