<?php
header("Content-type: text/json; charset=UTF-8");
//データベース接続用phpをrequire
require_once 'get_db.php';

$photo = $_FILES['photo'];
$photodata=$photo['tmp_name'];
$photoname=$photo['name'];

//echo $result;
//var_dump ($photo);
//var_dump ($photodata);

//ファイルをimageフォルダ内に保存
rename($photodata,"../images/$photoname");

//db接続したPDOを格納
$db=getsqlitedb();

//photo_nameテーブルに保存した写真の名前を保存するステートメント
$stmt=$db->prepare("INSERT INTO photo_name(name) VALUES(:photoname)");
$stmt->bindvalue(":photoname", $photoname);

//ステートメントの実行
$stmt->execute();

if ($photoname != null) {
    $result = "ok! photo saved.";
}
else{
    $result = "error!";
}
print json_encode($result)
?>

