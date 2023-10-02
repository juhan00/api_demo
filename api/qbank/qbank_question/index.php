<?php
require '../../config.php';
require 'functions.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if(isset($_GET['group_uuid'])) {
            $group_uuid = $_GET['group_uuid'];
            getQuestion($group_uuid);
        } 
        break;
    case 'POST':  
        createQuestion();
        break;
    case 'PUT':
        updateQuestion();
        break;
    case 'DELETE':
        if(isset($_GET['group_uuid'])) {
            $group_uuid = $_GET['group_uuid'];
            deleteQuestion($group_uuid);
        }
        break;
    default:
        http_response_code(405); // Method Not Allowed
        break;
}

?>