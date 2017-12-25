<?php
//header('Content-Type: application/json; charset=utf-8');
$photo = $_FILES['photo'];
/*
if ($photo['name'] != null) {
    $result = "ok";
}
else{
    $result = "no";
}


echo $result;
var_dump ($photo);
*/
$data = "ok";


print json_encode($data);
?>