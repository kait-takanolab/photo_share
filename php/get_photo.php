<?php

$photo = $_FILES['photo'];

if ($photo['name'] != null) {
    $result = "ok";
}
else{
    $result = "no";
}

echo $result;
var_dump ($photo);

?>