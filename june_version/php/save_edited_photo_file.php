<?php

// cropsizeはphp側

// get POST data
$photoname = __DIR__ . "/../images/" . $_POST["photoname"] . ".png";
$filter_parameters = $_POST["filter_parameters"];
$is_edited = $_POST["is_edited"] === "true";
$elapsed_time = $_POST["elapsed_time"];
$canvas_image = $_POST["canvas_image"];

// save photo
file_put_contents($photoname, base64_decode($canvas_image));
