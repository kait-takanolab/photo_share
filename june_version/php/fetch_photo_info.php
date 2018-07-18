<?php

//データベース接続用phpをrequire
require_once 'get_db.php';

$phto_info = file_get_contents("php://input");

//db接続したPDOを格納
$db=getsqlitedb();

//photoテーブルとeditテーブルに保存した写真の名前一覧を保存するステートメント
$stmt=$db->prepare("SELECT name FROM photo UNION SELECT name FROM edit");
//ステートメントの実行
$stmt->execute();

header('Content-type: application/json');
//js側で受け取るJSONデータをecho
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
