<?php

require_once __DIR__ . '/../php/get_db.php';

// 初期のスキーマ定義SQLの格納ディレクトリを指定
const SCHEMA_DIR = __DIR__ . "/schema";

$db=getsqlitedb();

$files=scandir(SCHEMA_DIR);
for ($i=2; $i<sizeof($files); $i++) {
    $statement = file_get_contents(SCHEMA_DIR . "/" . $files[$i]);
    try {
        $db->exec($statement);
    } catch (Exception $e) {
        echo "Failed file name: " . $files[$i]."\n";
        echo $e . "\n";
        unlink(DB_PATH);
        break;
    }
}
