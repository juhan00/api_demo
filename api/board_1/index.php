<?php
require '../config.php';
require 'functions.php';

$method = $_SERVER['REQUEST_METHOD'];


switch ($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            $id = $_GET['id'];
            getItem($id);
        } else {
            getCategoryItems();
        } 
        break;
    case 'POST':  
        createItem();
        break;
    case 'PUT':
        updateItem();
        break;
    case 'DELETE':
        if(isset($_GET['board_uuid'])) {
            $board_uuid = $_GET['board_uuid'];
            deleteItem($board_uuid);
        }
        break;
    default:
        http_response_code(405); // Method Not Allowed
        break;
}

?>