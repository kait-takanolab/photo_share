<?php

$photo = $_FILES['photo'];
$photodata=$_FILES['photo']['tmp_name'];

$photoname=$photo['name'];
if ($photo['name'] != null) {
    $result = "ok";
}
else{
    $result = "no";
}

//echo $result;
//var_dump ($photo);
//var_dump ($photodata);

rename($photodata,"../images/$photoname");

?>

