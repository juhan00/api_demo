<?php
$db_board = "board_1";
// function getAllItems() {
//     global $db, $db_board;
//     $query = $db->query('SELECT * FROM '. $db_board);
//     $items = $query->fetchAll(PDO::FETCH_ASSOC);

//     echo json_encode($items);
// }

function getItem($id) {
    global $db, $db_board;
    $query = $db->prepare('SELECT * FROM '. $db_board .' WHERE id = :id');
    $query->bindParam(':id', $id);
    $query->execute();
    $data = $query->fetch(PDO::FETCH_ASSOC);

    echo json_encode($data);
}

function getAllItems() {
    global $db, $db_board;
    
    $page = isset($_GET['page']) ? $_GET['page'] : 1;
    $per_page = isset($_GET['per_page']) ? $_GET['per_page'] : 10;

 

    // 시작 레코드 위치 계산
    $start = ($page - 1) * $per_page;

    // 게시물 조회 쿼리 생성
    $query = "SELECT * FROM $db_board LIMIT $start, $per_page";

    // 쿼리 실행 및 결과 가져오기
    $stmt = $db->prepare($query);
    $stmt->execute();
    $datas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($datas);
}

function getCategoryItems() {
    global $db, $db_board;

    $page = isset($_GET['page']) ? $_GET['page'] : 1;
    $per_page = isset($_GET['per_page']) ? $_GET['per_page'] : 10;
    $category_uuid = isset($_GET['category_uuid']) ? $_GET['category_uuid'] : null;

    // 시작 레코드 위치 계산
    $start = ($page - 1) * $per_page;

    // 게시물 조회 쿼리 생성
    $query = 'SELECT * FROM '. $db_board;

  
    // 카테고리 UUID가 주어진 경우에만 WHERE 절 추가
    if ($category_uuid !== null && $category_uuid !== 'null') {
        $query .= " WHERE category_uuid = :category_uuid";
    } else {
        // category_uuid가 unset인 경우 category_uuid 가져오기
        $category_uuids_query = "SELECT category_uuid FROM category";
        $category_uuids_stmt = $db->prepare($category_uuids_query);
        $category_uuids_stmt->execute();
        $category_uuids = $category_uuids_stmt->fetchAll(PDO::FETCH_COLUMN);
    
        // category_uuid들을 제외한 데이터 조회
        if (!empty($category_uuids)) {
            
            $category_uuids_str = implode("','", $category_uuids);
            // print_r($category_uuids_str);
            // exit;
            $query .= " WHERE category_uuid NOT IN ('$category_uuids_str') OR category_uuid IS NULL";
        }
    }

    $query .= " LIMIT $start, $per_page";

    // 쿼리 실행 및 결과 가져오기
    $stmt = $db->prepare($query);


    // 카테고리 UUID가 주어진 경우에만 바인딩
    if ($category_uuid !== null && $category_uuid !== 'null') {
        $stmt->bindValue(':category_uuid', $category_uuid);
    }

    $stmt->execute();
    $datas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($datas);
}

function createItem() {
    global $db, $db_board;
    
    $upload_dir = '../../uploads/';

    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true); // 디렉토리가 없으면 생성
    }

    try {
        // 게시글 데이터
        $category_uuid = isset($_POST['category_uuid']) ? $_POST['category_uuid'] : '';
        $title = isset($_POST['title']) ? $_POST['title'] : '';
        $content = isset($_POST['content']) ? $_POST['content'] : '';
        $uuid = isset($_POST['uuid']) ? $_POST['uuid'] : '';
        $video_type = isset($_POST['video_type']) ? $_POST['video_type'] : '';
        $video_link = isset($_POST['video_link']) ? $_POST['video_link'] : '';

        // 이미지 데이터
        $image1_data = isset($_FILES['image1']) ? $_FILES['image1'] : null;
        $image2_data = isset($_FILES['image2']) ? $_FILES['image2'] : null;
        $multi_images_data = isset($_FILES['multi_images']) ? $_FILES['multi_images'] : null;

        // image1 이미지 업로드 부분을 처리
        if($image1_data){
            $file_name = $image1_data['name'];
            $file_tmp_name = $image1_data['tmp_name'];

            // 이미지 파일 저장
            $ext = pathinfo($file_name, PATHINFO_EXTENSION); // 파일 확장자 추출
            $new_file_name = uniqid() . '.' . $ext;

            $target_path = $upload_dir . $new_file_name;
            
            if (move_uploaded_file($file_tmp_name, $target_path)) {
                insertImageQuery($db, $uuid, $new_file_name, $file_name, 'image1');
                echo "파일 '$file_name' 업로드 및 저장 완료\n";
            } else {
                echo "파일 '$file_name' 저장 실패\n";
            }
        }

        // image2 이미지 업로드 부분을 처리
        if($image2_data){
            $file_name = $image2_data['name'];
            $file_tmp_name = $image2_data['tmp_name'];

            // 이미지 파일 저장
            $ext = pathinfo($file_name, PATHINFO_EXTENSION); // 파일 확장자 추출
            $new_file_name = uniqid() . '.' . $ext;

            $target_path = $upload_dir . $new_file_name;
            
            if (move_uploaded_file($file_tmp_name, $target_path)) {
                insertImageQuery($db, $uuid, $new_file_name, $file_name, 'image2');
                echo "파일 '$file_name' 업로드 및 저장 완료\n";
            } else {
                echo "파일 '$file_name' 저장 실패\n";
            }
        }

        //멀티 이미지 업로드 부분을 처리
        if($multi_images_data){
            foreach ($multi_images_data['name'] as $index => $file_name){
                $file_tmp_name = $multi_images_data['tmp_name'][$index];

                // 이미지 파일 저장
                $ext = pathinfo($file_name, PATHINFO_EXTENSION); // 파일 확장자 추출
                $new_file_name = uniqid() . '.' . $ext;

                $target_path = $upload_dir . $new_file_name;
                
                if (move_uploaded_file($file_tmp_name, $target_path)) {
                    insertImageQuery($db, $uuid, $new_file_name, $file_name, 'multi');
                    echo "파일 '$file_name' 업로드 및 저장 완료\n";
                } else {
                    echo "파일 '$file_name' 저장 실패\n";
                }
            }
            
        }

        //DB저장
        $query = $db->prepare("INSERT INTO $db_board (category_uuid, title, content, uuid, datetime, video_type, video_link) VALUES (:category_uuid, :title, :content, :uuid, NOW(), :video_type, :video_link)");
        $query->bindParam(':category_uuid', $category_uuid);
        $query->bindParam(':title', $title);
        $query->bindParam(':content', $content);
        $query->bindParam(':uuid', $uuid);
        $query->bindParam(':video_type', $video_type);
        $query->bindParam(':video_link', $video_link);
        $query->execute();


        
    } catch (Exception $e) {
        echo "createPost에러";
    }
}

function insertImageQuery($db, $uuid, $new_file_name, $file_name, $file_use_type) {
    //image DB저장
    $query = $db->prepare("INSERT INTO image_file (board_uuid, file_name, og_file_name, datetime, file_use_type) VALUES (:uuid, :file_name, :og_file_name, NOW(), :file_use_type)");
    $query->bindParam(':board_uuid', $uuid);
    $query->bindParam(':file_name', $new_file_name);
    $query->bindParam(':og_file_name', $file_name);
    $query->bindParam(':file_use_type', $file_use_type);
    $query->execute();
}



function updateItem($id) {
    global $db, $db_board;
    $data = json_decode(file_get_contents('php://input'), true);
    $title = $data['title'];
    $content = $data['content'];

    $query = $db->prepare("UPDATE board_1 SET title = :title, content = :content WHERE id = :id");
    $query->bindParam(':title', $title);
    $query->bindParam(':content', $content);
    $query->bindParam(':id', $id);
    $query->execute();
}

function deleteItem($id) {
    global $db, $db_board;
    $query = $db->prepare("DELETE FROM board_1 WHERE id = :id");
    $query->bindParam(':id', $id);
    $query->execute();
}
