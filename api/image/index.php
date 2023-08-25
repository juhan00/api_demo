<?php
require '../config.php';
require 'functions.php';

$method = $_SERVER['REQUEST_METHOD'];

// echo $method;
// exit;
switch ($method) {
    case 'GET':
        if(isset($_GET['board_uuid'])) {
            $board_uuid = $_GET['board_uuid'];
            getImages($board_uuid);
        } else {
            // echo "여기?";
            // exit;
            getAllPosts();
        }
        break;
    case 'POST':  
        createImage();
        break;
    case 'PUT':
        if(isset($_GET['id'])) {
            $id = intval($_GET['id']);
            updatePost($id);
        }
        break;
    case 'DELETE':
        if(isset($_GET['id'])) {
            $id = intval($_GET['id']);
            deletePost($id);
        }
        break;
    default:
        http_response_code(405); // Method Not Allowed
        break;
}

?>