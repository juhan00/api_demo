<?php
require '../config.php';
require 'functions.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if(isset($_GET['question_uuid'])) {
            $question_uuid = $_GET['question_uuid'];
            getItem($question_uuid);
        } 
        break;
    case 'POST':  
        createItem();
        break;
    case 'PUT':
        updateItem();
        break;
    case 'DELETE':
        if(isset($_GET['question_uuid'])) {
            $question_uuid = $_GET['question_uuid'];
            deleteItem($question_uuid);
        }
        break;
    default:
        http_response_code(405); // Method Not Allowed
        break;
}

?>