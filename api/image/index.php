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
        updateImage();
        break;
    case 'DELETE':
        if(isset($_POST['file_use_type'])) {
            deleteImages();
        }else{
            deleteAllImages();
        }
        break;
    default:
        http_response_code(405); // Method Not Allowed
        break;
}

?>