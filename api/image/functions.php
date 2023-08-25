<?php
$db_table = "image_file";

function getAllPosts() {
    global $db;
    $query = $db->query("SELECT * FROM posts");
    $posts = $query->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($posts);
    // exit;
    // foreach ($posts as &$post) {
    //     $post['comments'] = getComments($post['id']);
    // }

    // echo json_encode($posts);
}

function getImages($board_uuid) {
    global $db, $db_table;
    $query = $db->prepare("SELECT * FROM $db_table WHERE board_uuid = :board_uuid");
    $query->bindParam(':board_uuid', $board_uuid);
    $query->execute();
    $datas = $query->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($datas);
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
//     $query = $db->prepare('INSERT INTO posts (title, content) VALUES (:title, :content)');
//     $query->bindParam(':title', $title);
//     $query->bindParam(':content', $content);
//     $query->execute();
// }

function createImage() {
    global $db, $db_table;
    
    $upload_dir = '../../uploads/';

    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true); // 디렉토리가 없으면 생성
    }

   
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $uuid = $data['uuid'];
        $file_data = $data['file_data'];

        
        // 파일 업로드 부분을 처리
        foreach ($file_data as $file) {
            $file_name = $file['name'];
            // $fileSize = $file['size'];
            $file_content = base64_decode($file['content']);

            $ext = substr($file_name, strrpos($file_name, '.') + 1); // 마지막 점(.) 이후의 문자열을 추출
            $new_file_name = uniqid() . '.' . $ext;

            $destination = $upload_dir . $new_file_name;
            if (file_put_contents($destination, $file_content)) {
                
                //DB저장
                $query = $db->prepare("INSERT INTO $db_table (uuid, file_name, og_file_name, date) VALUES (:uuid, :file_name, :og_file_name, NOW())");
                $query->bindParam(':uuid', $uuid);
                $query->bindParam(':file_name', $new_file_name);
                $query->bindParam(':og_file_name', $file_name);
                $query->execute();

                echo "파일 '$file_name' 업로드 및 저장 완료\n";
            } else {
                echo "파일 '$file_name' 저장 실패\n";
            }
        }
    

    } catch (Exception $e) {
        echo "createPost에러";
    }
}



function updatePost($id) {
    global $db, $db_table;
    $data = json_decode(file_get_contents('php://input'), true);
    $title = $data['title'];
    $content = $data['content'];

    $query = $db->prepare("UPDATE $db_table SET title = :title, content = :content WHERE id = :id");
    $query->bindParam(':title', $title);
    $query->bindParam(':content', $content);
    $query->bindParam(':id', $id);
    $query->execute();
}

function deletePost($id) {
    global $db, $db_table;
    $query = $db->prepare("DELETE FROM $db_table WHERE id = :id");
    $query->bindParam(':id', $id);
    $query->execute();
}

?>