<?php

header("Content-type: text/json; charset=UTF-8");

//写真データ
$photo = $_FILES['photo'];
$photodata=$photo['tmp_name'];
$photoname=$photo['name'];

//ジャイロデータ
$gyro['alpha'] = $_POST['gyro_a'];
$gyro['beta'] = $_POST['gyro_b'];
$gyro['gamma'] = $_POST['gyro_c'];

//撮影時間　カメラポジション
$t_time = $_POST['taketime'];
$position = $_POST['position'];


$result = $gyro;

print json_encode($result)
?>