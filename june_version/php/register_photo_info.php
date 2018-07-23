<?php

//データベース接続用phpをrequire
require_once 'get_db.php';
header("Content-type: text/json; charset=UTF-8");

//写真データ
$photo = $_FILES['photo'];
$photodata = $photo['tmp_name'];
$photoname = uniqid(rand(), true) . ".png"; 
$photopath = __DIR__ . "/../images/$photoname";
rename($photodata, $photopath);
$imagesize=getimagesize($photopath);
$photo_width=$imagesize[0];
$photo_height=$imagesize[1];
$photo_size=$photo_width . "," . $photo_height;

//ジャイロデータ
$gyro['alpha'] = $_POST['gyro_a'];
$gyro['beta'] = $_POST['gyro_b'];
$gyro['gamma'] = $_POST['gyro_c'];

//撮影時間　カメラポジション
$t_time = $_POST['taketime'];
$position = $_POST['position'];
$result = $gyro;

//ユーザid
$user_id = $_POST['user_id'];

$angle = '';
if ($gyro['beta'] < 60) {
    $angle = 'low';
} elseif ($gyro['beta'] >= 60 && $gyro['beta'] < 120) {
    $angle = 'middle';
} elseif ($gyro['beta'] >= 120) {
    $angle = 'high';
} else {
    $angle = null;
}

//DBに格納

//db接続したPDOを格納
$pdo = getsqlitedb();

//photoテーブルに保存した写真の名前を保存するステートメント
$stmt = $pdo->prepare("INSERT INTO photo(name,camera_angle,camera_position,take_duration,gyro_alpha,gyro_beta,gyro_gamma,size,user_id) VALUES(:photoname,:angle,:position,:take_duration,:gyro_alpha,:gyro_beta,:gyro_gamma,:photo_size,:user_id)");
$stmt->bindvalue(":photoname", $photoname);
$stmt->bindvalue(":angle", $angle);
$stmt->bindvalue(":position", $position);
$stmt->bindvalue(":take_duration", $t_time);
$stmt->bindvalue(":gyro_alpha", $gyro["alpha"]);
$stmt->bindvalue(":gyro_beta", $gyro["beta"]);
$stmt->bindvalue(":gyro_gamma", $gyro["gamma"]);
$stmt->bindvalue(":photo_size", $photo_size);
$stmt->bindvalue(":user_id", $user_id);
//ステートメントの実行
$stmt->execute();

if ($photoname != null) {
    $result = "ok! photo saved.";
} else {
    $result = "error!";
}

print json_encode($result);
