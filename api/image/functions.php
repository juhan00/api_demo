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
        $board_uuid = $data['board_uuid'];
        $file_data = $data['file_data'];
        $file_use_type = $data['file_use_type'];

        
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
                $query = $db->prepare("INSERT INTO $db_table (board_uuid, file_name, og_file_name, datetime, file_use_type) VALUES (:board_uuid, :file_name, :og_file_name, NOW(), :file_use_type)");
                $query->bindParam(':board_uuid', $board_uuid);
                $query->bindParam(':file_name', $new_file_name);
                $query->bindParam(':og_file_name', $file_name);
                $query->bindParam(':file_use_type', $file_use_type);

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



function updateImage() {
    global $db, $db_table;
    
    $upload_dir = '../../uploads/';

    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true); // 디렉토리가 없으면 생성
    }

    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $image_id = $data['image_id']; // 이미지의 고유 ID
        $file_data = $data['file_data'];
        $file_use_type = $data['file_use_type'];

        // 기존 이미지 정보 가져오기
        $query = $db->prepare("SELECT * FROM $db_table WHERE id = :image_id");
        $query->bindParam(':image_id', $image_id);
        $query->execute();
        $image_info = $query->fetch(PDO::FETCH_ASSOC);

        if ($image_info) {
            // 파일 업로드 부분을 처리
            $file_name = $file_data['name'];
            $file_content = base64_decode($file_data['content']);

            $ext = substr($file_name, strrpos($file_name, '.') + 1); // 마지막 점(.) 이후의 문자열을 추출
            $new_file_name = uniqid() . '.' . $ext;

            $destination = $upload_dir . $new_file_name;
            if (file_put_contents($destination, $file_content)) {
                // 기존 파일 삭제
                $existing_file_path = $upload_dir . $image_info['file_name'];
                if (file_exists($existing_file_path)) {
                    unlink($existing_file_path);
                }

                // DB 업데이트
                $update_query = $db->prepare("UPDATE $db_table SET file_name = :new_file_name, og_file_name = :og_file_name, file_use_type = :file_use_type WHERE id = :image_id");
                $update_query->bindParam(':new_file_name', $new_file_name);
                $update_query->bindParam(':og_file_name', $file_name);
                $update_query->bindParam(':file_use_type', $file_use_type);
                $update_query->bindParam(':image_id', $image_id);
                $update_query->execute();

                echo "파일 '$file_name' 업로드 및 업데이트 완료\n";
            } else {
                echo "파일 '$file_name' 업데이트 실패\n";
            }
        } else {
            echo "이미지 정보를 찾을 수 없음\n";
        }
    } catch (Exception $e) {
        echo "updateImage 에러";
    }
}

function deleteImages($board_uuid, $file_use_type) {
    global $db, $db_table;
    
    try {
        // 이미지 정보를 조회
        $query = $db->prepare("SELECT * FROM $db_table WHERE board_uuid = :board_uuid AND file_use_type = :file_use_type");
        $query->bindParam(':board_uuid', $board_uuid);
        $query->bindParam(':file_use_type', $file_use_type);
        $query->execute();
        $image_info_list = $query->fetchAll(PDO::FETCH_ASSOC);

        foreach ($image_info_list as $image_info) {
            $file_name = $image_info['file_name'];
            
            // 이미지 파일 삭제
            $upload_dir = '../../uploads/';
            $file_path = $upload_dir . $file_name;

            if (unlink($file_path)) {
                // 이미지 정보 삭제
                $delete_query = $db->prepare("DELETE FROM $db_table WHERE board_uuid = :board_uuid AND file_name = :file_name");
                $delete_query->bindParam(':board_uuid', $board_uuid);
                $delete_query->bindParam(':file_name', $file_name);
                $delete_query->execute();

                echo "파일 및 이미지 정보 삭제 완료\n";
            } else {
                echo "파일 삭제 실패\n";
            }
        }
    } catch (Exception $e) {
        echo "deleteImages 에러";
    }
}

function deleteAllImages($board_uuid) {
    global $db, $db_table;
    
    try {
        // 이미지 정보를 조회
        $query = $db->prepare("SELECT * FROM $db_table WHERE board_uuid = :board_uuid");
        $query->bindParam(':board_uuid', $board_uuid);
        $query->execute();
        $image_info = $query->fetchAll(PDO::FETCH_ASSOC);

        if ($image_info) {
            $upload_dir = '../../uploads/';
            
            foreach ($image_info as $image) {
                $file_path = $upload_dir . $image['file_name'];
                
                if (unlink($file_path)) {
                    echo "파일 삭제 성공: $file_path\n";
                } else {
                    echo "파일 삭제 실패: $file_path\n";
                }
            }
            
            // 이미지 정보 삭제
            $delete_query = $db->prepare("DELETE FROM $db_table WHERE board_uuid = :board_uuid");
            $delete_query->bindParam(':board_uuid', $board_uuid);
            $delete_query->execute();

            echo "이미지 정보 삭제 완료\n";
        } else {
            echo "해당 이미지 정보가 없음\n";
        }
    } catch (Exception $e) {
        echo "deleteAllImages 에러\n";
    }
}

?>