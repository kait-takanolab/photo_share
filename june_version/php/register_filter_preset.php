<?php

//データベース接続用phpをrequire
require_once 'get_db.php';

// get POST data
$json_string = file_get_contents('php://input');
$json = json_decode($json_string);
$preset_name = $json->name;
$filter_parameters = $json->filter_parameters;

//db接続したPDOを格納
$pdo = getsqlitedb();

//filterテーブルに保存した写真の名前を保存するステートメント
$stmt = $pdo->prepare("INSERT INTO
filter_preset(name,gaussian_filter,contrast_filter,grayscale_filter,sepia_filter,invert_filter,hue_rotate_filter,lightness_filter,saturation_filter)
VALUES(:name,:gaussian_filter,:contrast_filter,:grayscale_filter,:sepia_filter,:invert_filter,:hue_rotate_filter,:lightness_filter,:saturation_filter)");
$stmt->bindvalue(":name", $preset_name);
$stmt->bindvalue(":gaussian_filter", $filter_parameters->gaussian);
$stmt->bindvalue(":contrast_filter", $filter_parameters->contrast);
$stmt->bindvalue(":grayscale_filter", $filter_parameters->grayscale);
$stmt->bindvalue(":sepia_filter", $filter_parameters->sepia);
$stmt->bindvalue(":invert_filter", $filter_parameters->invert);
$stmt->bindvalue(":hue_rotate_filter", $filter_parameters->hue_rotate);
$stmt->bindvalue(":lightness_filter", $filter_parameters->lightness);
$stmt->bindvalue(":saturation_filter", $filter_parameters->saturation);

//ステートメントの実行
$stmt->execute();

// filter preset を全て取得
$preset_stmt = $pdo->prepare("SELECT * FROM filter_preset");
//ステートメントの実行
$preset_stmt->execute();
$presets = $preset_stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-type: application/json');
//js側で受け取るJSONデータをecho
echo json_encode($presets);
