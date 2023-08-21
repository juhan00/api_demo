<?php
require '../config.php';
require 'functions.php';

$method = $_SERVER['REQUEST_METHOD'];

// echo $method;
// exit;
switch ($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            $id = intval($_GET['id']);
            getPost($id);
        } else {
            // echo "여기?";
            // exit;
            getAllPosts();
        }
        break;
    case 'POST':  
        // echo "여기?";
        // exit;
        if(isset($_GET['id']) && $_GET['action'] === 'comment') {
            $post_id = intval($_GET['id']);
            createComment($post_id);
        } else {
            
            // if(isset($_FILES['files'])) {
                
            //     $uploadedFiles = $_FILES['files'];
            //     $uploadedFilesName = '';
            //     foreach ($uploadedFiles['tmp_name'] as $key => $tmp_name) {
            //         $fileName = $uploadedFiles['name'][$key];
            //         $fileSize = $uploadedFiles['size'][$key];
            //         $fileType = $uploadedFiles['type'][$key];
            //         $fileError = $uploadedFiles['error'][$key];
        
            //         if ($fileError === UPLOAD_ERR_OK) {
            //             $destination = $uploadDir . $fileName;
            //             if (move_uploaded_file($tmp_name, $destination)) {
            //                 echo "파일 '$fileName' 업로드 및 저장 완료";
            //                 $uploadedFilesName = $uploadedFilesName . '|' . $fileName;
            //             } else {
            //                 echo "파일 '$fileName' 저장 실패";
            //             }
            //         } else {
            //             throw new Exception("파일 업로드 에러: $fileError");
            //         }
            //     }
            // }
            createPost();
        }
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