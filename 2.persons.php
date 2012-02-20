<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
    switch ($_SERVER['REQUEST_METHOD']){
        case 'PUT':
            $values_json = file_get_contents('php://input');
            $values_array = json_decode($values_json, true);
            echo $values_json;
            break;
    }