<?php
$array = ['key1' => $_POST["req1"], 'key2' => isset($_POST["req2"]) ? $_POST["req2"] : '', 'key3' => $_POST["req3"][0], 'key4' => $_POST["req3"][1], 'key5' => $_POST["req4"]["a"]];
echo json_encode(['data' => $array]);
