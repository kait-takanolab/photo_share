<?php

header('Content-type: application/json');
$data['alpha'] = $_POST['alpha'];
$data['beta'] = $_POST['beta'];
$data['gamma'] = $_POST['gamma'];
$data['time'] = $_POST['time'];

print json_encode($data);

?>