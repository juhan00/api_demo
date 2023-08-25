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
        // else if (isset($_GET['category_uuid'])) {
        //     // echo "여기?";
        //     // exit;
        //     getCategoryItems();
        // } 
        // else {
        //     getAllItems();
        // }
        break;
    case 'POST':  
        createItem();
        break;
    case 'PUT':
        if(isset($_GET['id'])) {
            $id = intval($_GET['id']);
            updateItem($id);
        }
        break;
    case 'DELETE':
        if(isset($_GET['id'])) {
            $id = intval($_GET['id']);
            deleteItem($id);
        }
        break;
    default:
        http_response_code(405); // Method Not Allowed
        break;
}

?>