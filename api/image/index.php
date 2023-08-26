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
        $board_uuid = $_GET['board_uuid'];
        $file_use_type = $_GET['file_use_type'];
        if(isset($file_use_type)) {       
            deleteImages($board_uuid, $file_use_type);
        }else{
            deleteAllImages($board_uuid);
        }
        break;
    default:
        http_response_code(405); // Method Not Allowed
        break;
}

?>