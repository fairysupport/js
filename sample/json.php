<?php
$req = json_decode(file_get_contents('php://input'), true);
$array = ['key1' => $req["req1"], 'key2' => $req["req2"], 'key3' => $req["req3"][0], 'key4' => $req["req3"][1], 'key5' => $req["req4"]["a"]];
echo json_encode(['data' => $array]);
