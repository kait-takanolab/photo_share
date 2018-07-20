<?php

//データベース接続用phpをrequire
require_once 'get_db.php';

$phto_info = file_get_contents("php://input");

//db接続したPDOを格納
$db=getsqlitedb();

//photoテーブルに保存した写真の名前一覧を保存するステートメント
$stmt=$db->prepare("SELECT name FROM photo");
//ステートメントの実行
$stmt->execute();
$photo_names = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($photo_names as $i => &$v) {
    $v["is_edited"] = false;
}

//editテーブルに保存した写真の名前一覧を保存するステートメント
$stmt=$db->prepare("SELECT name FROM edit");
//ステートメントの実行
$stmt->execute();
$edit_names = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($edit_names as $i => &$v) {
    $v["is_edited"] = true;
}

$ret = array_merge($photo_names, $edit_names);

header('Content-type: application/json');
//js側で受け取るJSONデータをecho
echo json_encode($ret);
