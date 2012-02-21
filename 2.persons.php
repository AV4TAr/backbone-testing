<?php

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
require_once('mongo_connect.php');

//Selecciono la coleccion
$mongoPersons = $db->Persons;
$values_array = array();
switch ($_SERVER['REQUEST_METHOD']){
    //Insert
    case 'POST':
        $values_json = file_get_contents('php://input');
        $values_array = json_decode($values_json, true);
        
        $safe_insert = true;
        $mongoPersons->insert($values_array, $safe_insert);
        //echo $values_json;
        break;
    //Update
    case 'PUT':
        $values_json = file_get_contents('php://input');
        $values_array = json_decode($values_json, true);
        $safe_insert = true;
        $mongoPersons->insert($values_array, $safe_insert);
        //echo $values_json;
        break;
    
    case 'GET':
        $cursor = $mongoPersons->find();
        foreach($cursor as $k => $record){
            $aux = array();
            $aux['id'] = $k;
            $aux['firstName'] = $record['firstName'];
            $aux['lastName'] = $record['lastName'];
            $values_array[] = $aux;
        }
        //print_r($results);
        break;
}
echo json_encode($values_array);