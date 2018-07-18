<?php

//データベース接続用phpをrequire
require_once 'get_db.php';
header("Content-type: text/json; charset=UTF-8");

//写真データ
$photo = $_FILES['photo'];
$photodata = $photo['tmp_name'];
$photoname = $photo['name'];

rename($photodata, "../images/$photoname");

//ジャイロデータ
$gyro['alpha'] = $_POST['gyro_a'];
$gyro['beta'] = $_POST['gyro_b'];
$gyro['gamma'] = $_POST['gyro_c'];

//撮影時間　カメラポジション
$t_time = $_POST['taketime'];
$position = $_POST['position'];
$result = $gyro;

$angle = '';
if ($gyro['beta'] < 60) {
    $angle = 'low';
} else if ($gyro['beta'] >= 60 && $gyro['beta'] < 120) {
    $angle = 'middle';
} else if ($gyro['beta'] >= 120) {
    $angle = 'high';
}
else{
    $angle = null;
}

//DBに格納

//db接続したPDOを格納
$pdo = getsqlitedb();

$stmt = $pdo->prepare("INSERT INTO gyro_data(gyro_alpha,gyro_beta,gyro_gamma) VALUES(:alpha,:beta,:gamma)");
$stmt->bindvalue(":alpha", $gyro['alpha']);
$stmt->bindvalue(":beta", $gyro['beta']);
$stmt->bindvalue(":gamma", $gyro['gamma']);

//ステートメントの実行
$stmt->execute();
$gyro_id = $pdo->lastinsertid();

//photo_nameテーブルに保存した写真の名前を保存するステートメント
$stmt = $pdo->prepare("INSERT INTO photo_data(photo_name,gyro_id,angle,position,take_photo_duration) VALUES(:photoname,:gyro,:angle,:position,:time)");
$stmt->bindvalue(":photoname", $photoname);
$stmt->bindvalue(":gyro", $gyro_id);
$stmt->bindvalue(":angle", $angle);
$stmt->bindvalue(":position", $position);
$stmt->bindvalue(":time", $t_time);
//ステートメントの実行
$stmt->execute();

if ($photoname != null) {
    $result = "ok! photo saved.";
} else {
    $result = "error!";
}

print json_encode($result)
?>