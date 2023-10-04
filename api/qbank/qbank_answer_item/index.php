<?php
require '../../config.php';
require 'functions.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if(isset($_GET['answer_uuid'])) {
            $answer_uuid = $_GET['answer_uuid'];
            getAnswerItem($answer_uuid);
        }
        break;
    case 'POST':  
        createAnswerItem();
        break;
    case 'PUT':
        if(isset($_GET['id'])){
            $id = $_GET['id'];
            updateAnswerItem($id);
        }  
        break;
    case 'DELETE':
        if(isset($_GET['id'])) {
            $id = $_GET['id'];
            deleteAnswerItem($id);
        }
        break;
    default:
        http_response_code(405); // Method Not Allowed
        break;
}

?>