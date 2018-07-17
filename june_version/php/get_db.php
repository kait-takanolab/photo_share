<?php

// sqlite3のDBファイル
const DB_PATH = __DIR__ . "/../db/photo_share.sqlite3";

function getsqlitedb()
{
    $sqlitedb = new PDO('sqlite:' . DB_PATH);
    mb_language("uni");
    mb_internal_encoding("utf-8");
    mb_http_input("auto");
    mb_http_output("utf-8");
    $sqlitedb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sqlitedb->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    return $sqlitedb;
}
