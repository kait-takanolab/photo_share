<?php


//データベース接続用phpをrequire
require_once 'get_db.php';

$color_priset = [
    'test1' => [
        "gaussian_filter"=>"0",
        "contrast_filter"=>"27",
        "grayscale_filter"=>"0",
        "sepia_filter"=>"0",
        "invert_filter"=>"0",
        "hue_rotate_filter"=>"0",
        "lightness_filter"=>"90",
        "saturation_filter"=>"107"
    ],
    'test2' => [
        "gaussian_filter"=>"0",
        "contrast_filter"=>"15",
        "grayscale_filter"=>"26",
        "sepia_filter"=>"3",
        "invert_filter"=>"0",
        "hue_rotate_filter"=>"0",
        "lightness_filter"=>"73",
        "saturation_filter"=>"112"
    ]
];

$count_priset = [
    'test1'=>['null'],'test2'=>['null']
];

//db接続したPDOを格納
$pdo = getsqlitedb();

// filter preset を全て取得
$stmt = $pdo->prepare("SELECT * FROM edit");
//ステートメントの実行
$stmt->execute();
$edit_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($edit_data as $data) {
    #var_dump($data);

    #プリセットのサーチ
    foreach ($color_priset as $priset_name) {
        if ( $data["gaussian_filter"] === $priset_name["gaussian_filter"] &&
        $data["contrast_filter"] === $priset_name["contrast_filter"] &&
        $data["grayscale_filter"] === $priset_name["grayscale_filter"] &&
        $data["sepia_filter"] === $priset_name["sepia_filter"] &&
        $data["invert_filter"] === $priset_name["invert_filter"] &&
        $data["hue_rotate_filter"] === $priset_name["hue_rotate_filter"] &&
        $data["lightness_filter"] === $priset_name["lightness_filter"] &&
        $data["saturation_filter"] === $priset_name["saturation_filter"]
        ){
            # code...
            #array_push($count_priset[$priset_name],$data["id"]);
            #echo $data["id"];
        }
    }

}


#var_dump($count_priset);

#echo json_encode($edit_data);



?>