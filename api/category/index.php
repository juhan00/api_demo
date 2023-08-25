<?php
require '../config.php';
require 'functions.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        
        if(isset($_GET['board_name'])) {
            $board_name = $_GET['board_name'];
            getCategory($board_name);
        } 
        break;
    case 'POST':  
        createCategory();
        break;
    case 'PUT':
        if($_GET['category_uuid']) {
            $category_uuid = $_GET['category_uuid'];
            updateCategory($category_uuid);
        }
        break;
    case 'DELETE':
        if($_GET['category_uuid']) {
            $category_uuid = $_GET['category_uuid'];
            deleteCategory($category_uuid);
        }
        break;
    default:
        http_response_code(405); // Method Not Allowed
        break;
}

?>