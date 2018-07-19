<?php

//データベース接続用phpをrequire
require_once 'get_db.php';

// get POST data
$photoname =  $_POST["photoname"] . ".png";
$photopath = __DIR__ . "/../images/" . $photoname;
$filter_parameters = json_decode($_POST["filter_parameters"]);
$is_edited = $_POST["is_edited"] === "true";
$elapsed_time = $_POST["elapsed_time"];
$canvas_image = $_POST["canvas_image"];
$original_photoname = $_POST["original_photoname"];

// save photo data to a file
file_put_contents($photopath, base64_decode($canvas_image));

// get saved photo size
$imagesize=getimagesize($photopath);
$photo_width=$imagesize[0];
$photo_height=$imagesize[1];
$photo_size=$photo_width . "," . $photo_height;

//DBに格納

//db接続したPDOを格納
$pdo = getsqlitedb();

//photoテーブルに保存した写真の名前を保存するステートメント
$stmt = $pdo->prepare("INSERT INTO
edit(name,crop_size,edit_duration,gaussian_filter,contrast_filter,grayscale_filter,sepia_filter,invert_filter,hue_rotate_filter,lightness_filter,saturation_filter,photo_id,edit_id)
VALUES(:name,:crop_size,:edit_duration,:gaussian_filter,:contrast_filter,:grayscale_filter,:sepia_filter,:invert_filter,:hue_rotate_filter,:lightness_filter,:saturation_filter,:photo_id,:edit_id)");
$stmt->bindvalue(":name", $photoname);
$stmt->bindvalue(":crop_size", $photo_size);
$stmt->bindvalue(":edit_duration", $elapsed_time);
$stmt->bindvalue(":gaussian_filter", $filter_parameters->gaussian);
$stmt->bindvalue(":contrast_filter", $filter_parameters->contrast);
$stmt->bindvalue(":grayscale_filter", $filter_parameters->grayscale);
$stmt->bindvalue(":sepia_filter", $filter_parameters->sepia);
$stmt->bindvalue(":invert_filter", $filter_parameters->invert);
$stmt->bindvalue(":hue_rotate_filter", $filter_parameters->hue_rotate);
$stmt->bindvalue(":lightness_filter", $filter_parameters->lightness);
$stmt->bindvalue(":saturation_filter", $filter_parameters->saturation);
$fetch_photo_table = "photo";
if ($is_edited) {
    $fetch_photo_table = "edit";
}
$fetch_id_stmt = $pdo->prepare("SELECT id FROM " . $fetch_photo_table . " where name == :original_photoname");
$fetch_id_stmt->bindvalue(":original_photoname", $original_photoname);
$fetch_id_stmt->execute();
$id = $fetch_id_stmt->fetchAll(PDO::FETCH_ASSOC)[0]["id"];
if ($fetch_photo_table === "photo") {
    $stmt->bindvalue(":photo_id", $id);
    $stmt->bindvalue(":edit_id", null);
} else {
    $stmt->bindvalue(":photo_id", null);
    $stmt->bindvalue(":edit_id", $id);
}

//ステートメントの実行
$stmt->execute();

// 前のページに強制的に戻す
// ホントはsubmitしても画面遷移させたくないんだけど
// 上手く行かないので強制的に前のページにリダイレクトする
$reffer_url = parse_url($_SERVER["HTTP_REFERER"]);
$redirect_url = $reffer_url["scheme"] . "://" . $reffer_url["host"] . $reffer_url["path"];
$redirect_url = $redirect_url . "?photo_name=images/".$photoname."&is_edited=true";
header("Location: " . $redirect_url, true, 303);
