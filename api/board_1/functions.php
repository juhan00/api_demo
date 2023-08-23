<?php
$db_board = "board_1";
function getAllItems() {
    global $db, $db_board;
    $query = $db->query('SELECT * FROM '. $db_board);
    $posts = $query->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($posts);
    // exit;
    // foreach ($posts as &$post) {
    //     $post['comments'] = getComments($post['id']);
    // }

    // echo json_encode($posts);
}

function getItem($id) {
    global $db, $db_board;
    $query = $db->prepare('SELECT * FROM '. $db_board .' WHERE id = :id');
    $query->bindParam(':id', $id);
    $query->execute();
    $post = $query->fetch(PDO::FETCH_ASSOC);

    echo json_encode($post);
    // if ($post) {
    //     $post['comments'] = getComments($post['id']);
    //     echo json_encode($post);
    // } else {
    //     http_response_code(404); // Not Found
    // }
}

// function createPost() {
//     global $db;
   
//     $data = json_decode(file_get_contents('php://input'), true);
//     $title = $data['title'];
//     $content = $data['content'];
//     $query = $db->prepare('INSERT INTO board_1 (title, content) VALUES (:title, :content)');
//     $query->bindParam(':title', $title);
//     $query->bindParam(':content', $content);
//     $query->execute();
// }

function createItem() {
    global $db, $db_board;
    
    $upload_dir = '../../uploads/';

    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true); // 디렉토리가 없으면 생성
    }

    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $title = $data['title'];
        $content = $data['content'];
        $uuid = $data['uuid'];
        $image1_data = $data['image1_data'];
        // $image2_data = $data['image2_data'];
        // $multi_image_data = $data['multi_image_data'];
        // $video_type = $data['video_type'];
        // $video_link = $data['video_link'];
        

        // // image1 파일 업로드 부분을 처리
        // if($image1_data){
       
        //     foreach ($image1_data as $file) {
        //         echo $file['name'];
        //         exit;
        //     }
        // }
        // image1 파일 업로드 부분을 처리
        echo json_encode($image1_data);
            exit;
        if($image1_data){
           
            foreach ($image1_data as $file) {
                
                $file_name = $file['name'];
                
                // $fileSize = $file['size'];
                $file_content = base64_decode($file['content']);
    
                $ext = substr($file_name, strrpos($file_name, '.') + 1); // 마지막 점(.) 이후의 문자열을 추출
                $new_file_name = uniqid() . '.' . $ext;
    
                $destination = $upload_dir . $new_file_name;
                if (file_put_contents($destination, $file_content)) {
                    insertQuery($db, $uuid, $new_file_name, $file_name, 'image1');
    
                    echo "파일 '$file_name' 업로드 및 저장 완료\n";
                } else {
                    echo "파일 '$file_name' 저장 실패\n";
                    exit;
                }
            }
        }


        // // image2 파일 업로드 부분을 처리
        // if($image2_data){
        //     foreach ($image2_data as $file) {
        //         $file_name = $file['name'];
        //         // $fileSize = $file['size'];
        //         $file_content = base64_decode($file['content']);
    
        //         $ext = substr($file_name, strrpos($file_name, '.') + 1); // 마지막 점(.) 이후의 문자열을 추출
        //         $new_file_name = uniqid() . '.' . $ext;
    
        //         $destination = $upload_dir . $new_file_name;
        //         if (file_put_contents($destination, $file_content)) {
        //             insertQuery($db, $uuid, $new_file_name, $file_name, 'image2');
    
        //             echo "파일 '$file_name' 업로드 및 저장 완료\n";
        //         } else {
        //             echo "파일 '$file_name' 저장 실패\n";
        //         }
        //     }
        // }

        // // multi image 파일 업로드 부분을 처리
        // if($multi_image_data){
        //     foreach ($multi_image_data as $file) {
        //         $file_name = $file['name'];
        //         // $fileSize = $file['size'];
        //         $file_content = base64_decode($file['content']);
    
        //         $ext = substr($file_name, strrpos($file_name, '.') + 1); // 마지막 점(.) 이후의 문자열을 추출
        //         $new_file_name = uniqid() . '.' . $ext;
    
        //         $destination = $upload_dir . $new_file_name;
        //         if (file_put_contents($destination, $file_content)) {
        //             insertQuery($db, $uuid, $new_file_name, $file_name, 'multi_image');
    
        //             echo "파일 '$file_name' 업로드 및 저장 완료\n";
        //         } else {
        //             echo "파일 '$file_name' 저장 실패\n";
        //         }
        //     }
        // }

        // //DB저장
        // $query = $db->prepare('INSERT INTO ' . $db_board . ' (title, content, uuid, datetime, video_type, video_link) VALUES (:title, :content, :uuid, NOW(), :video_type, :video_link)');
        // $query->bindParam(':title', $title);
        // $query->bindParam(':content', $content);
        // $query->bindParam(':uuid', $uuid);
        // $query->bindParam(':video_type', $video_type);
        // $query->bindParam(':video_link', $video_link);
        // $query->execute();


        // function insertQuery($db, $uuid, $new_file_name, $file_name, $file_use_type) {
        //     echo "여기까지?";
        //     exit;
        //     //image DB저장
        //     $query = $db->prepare('INSERT INTO image_file (uuid, file_name, og_file_name, datetime, file_use_type) VALUES (:uuid, :file_name, :og_file_name, NOW(), :file_use_type)');
        //     $query->bindParam(':uuid', $uuid);
        //     $query->bindParam(':file_name', $new_file_name);
        //     $query->bindParam(':og_file_name', $file_name);
        //     $query->bindParam(':file_use_type', $file_use_type);
        //     $query->execute();
        // }
    } catch (Exception $e) {
        echo "createPost에러";
    }
}



function updateItem($id) {
    global $db, $db_board;
    $data = json_decode(file_get_contents('php://input'), true);
    $title = $data['title'];
    $content = $data['content'];

    $query = $db->prepare('UPDATE board_1 SET title = :title, content = :content WHERE id = :id');
    $query->bindParam(':title', $title);
    $query->bindParam(':content', $content);
    $query->bindParam(':id', $id);
    $query->execute();
}

function deleteItem($id) {
    global $db, $db_board;
    $query = $db->prepare('DELETE FROM board_1 WHERE id = :id');
    $query->bindParam(':id', $id);
    $query->execute();
}
