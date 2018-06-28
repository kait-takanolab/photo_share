<?php

//データベース接続用phpをrequire
require_once 'conect_DB.php';

//db接続したPDOを格納
$db=getsqlitedb();

//photo_nameテーブルに保存した写真の名前を保存するステートメント
$stmt=$db->prepare("SELECT * FROM photodata LIMIT 2");
//ステートメントの実行
$stmt->execute();

header('Content-type: application/json');
//js側で受け取るJSONデータをecho
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

?>