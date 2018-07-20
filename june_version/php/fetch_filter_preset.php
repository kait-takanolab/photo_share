<?php

//データベース接続用phpをrequire
require_once 'get_db.php';

//db接続したPDOを格納
$pdo = getsqlitedb();

// filter preset を全て取得
$stmt = $pdo->prepare("SELECT * FROM filter_preset");
//ステートメントの実行
$stmt->execute();
$presets = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-type: application/json');
//js側で受け取るJSONデータをecho
echo json_encode($presets);
