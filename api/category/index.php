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
        // echo "여기까지?";
        // exit;
        if($_GET['category_id']) {
            $category_id = $_GET['category_id'];
            updateCategory($category_id);
        }
        break;
    case 'DELETE':
        if($_GET['category_id']) {
            $category_id = $_GET['category_id'];
            deleteCategory($category_id);
        }
        break;
    default:
        http_response_code(405); // Method Not Allowed
        break;
}

?>