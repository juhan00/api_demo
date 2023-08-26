<?php
$db_table = "board_1";

function getItem($id) {
    global $db, $db_table;
    
    try {
        $query = $db->prepare("SELECT * FROM $db_table WHERE id = :id");
        $query->bindParam(':id', $id);
        $query->execute();
        $data = $query->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        echo "getItem에러 $e";
    }
    

    echo json_encode($data);
}

function getCategoryItems() {
    global $db, $db_table;

    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $per_page = isset($_GET['per_page']) ? intval($_GET['per_page']) : 10;
    $category_uuid = isset($_GET['category_uuid']) ? $_GET['category_uuid'] : null;

    // 시작 레코드 위치 계산
    $start = ($page - 1) * $per_page;

    try {
        // 데이터 총 개수 조회 쿼리 생성
        $count_query = 'SELECT COUNT(*) FROM ' . $db_table;

        // 카테고리 UUID가 주어진 경우에만 WHERE 절 추가
        if ($category_uuid !== null && $category_uuid !== 'null' && $category_uuid !== 'all') {
            $count_query .= " WHERE category_uuid = :category_uuid";
        }

        // 쿼리 실행 및 결과 가져오기
        $count_stmt = $db->prepare($count_query);

        // 카테고리 UUID가 주어진 경우에만 바인딩
        if ($category_uuid !== null && $category_uuid !== 'null' && $category_uuid !== 'all') {
            $count_stmt->bindValue(':category_uuid', $category_uuid);
        }

        $count_stmt->execute();
        $total_count = intval($count_stmt->fetchColumn());

        // 게시물 조회 쿼리 생성
        $query = 'SELECT * FROM ' . $db_table;

        // 카테고리 UUID가 주어진 경우에만 WHERE 절 추가
        if ($category_uuid !== null && $category_uuid !== 'null' && $category_uuid !== 'all') {
            $query .= " WHERE category_uuid = :category_uuid";
        } else if ($category_uuid === 'all') {
            // "all"인 경우 WHERE 절 없이 모든 데이터 조회
        } else {
            // category_uuid가 unset인 경우 category_uuid 가져오기
            $category_uuids_query = "SELECT category_uuid FROM category";
            $category_uuids_stmt = $db->prepare($category_uuids_query);
            $category_uuids_stmt->execute();
            $category_uuids = $category_uuids_stmt->fetchAll(PDO::FETCH_COLUMN);

            // category_uuid들을 제외한 데이터 조회
            if (!empty($category_uuids)) {
                $category_uuids_str = implode("','", $category_uuids);
                $query .= " WHERE category_uuid NOT IN ('$category_uuids_str') OR category_uuid IS NULL";
            }
        }

        $query .= " LIMIT $start, $per_page";

        // 쿼리 실행 및 결과 가져오기
        $stmt = $db->prepare($query);

        // 카테고리 UUID가 주어진 경우에만 바인딩
        if ($category_uuid !== null && $category_uuid !== 'null' && $category_uuid !== 'all') {
            $stmt->bindValue(':category_uuid', $category_uuid);
        }

        $stmt->execute();
        $datas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // 결과 출력
        $result = [
            'data' => $datas,
            'total_count' => $total_count,
            'page' => $page,
            'per_page' => $per_page
        ];

        echo json_encode($result);
    } catch (Exception $e) {
        echo "getCategoryItems 에러: " . $e->getMessage();
    }
}

function createItem() {
    global $db, $db_table;

    try {
        // 게시글 데이터
        $data = json_decode(file_get_contents('php://input'), true);
        $category_uuid = $data['category_uuid'];
        $title = $data['title'];
        $content = $data['content'];
        $uuid = $data['uuid'];
        $video_type = $data['video_type'];
        $video_link = $data['video_link'];

        //DB저장
        $query = $db->prepare("INSERT INTO $db_table (category_uuid, title, content, uuid, datetime, video_type, video_link) VALUES (:category_uuid, :title, :content, :uuid, NOW(), :video_type, :video_link)");
        $query->bindParam(':category_uuid', $category_uuid);
        $query->bindParam(':title', $title);
        $query->bindParam(':content', $content);
        $query->bindParam(':uuid', $uuid);
        $query->bindParam(':video_type', $video_type);
        $query->bindParam(':video_link', $video_link);
        $query->execute();
    } catch (Exception $e) {
        echo "createItem에러 $e";
    }
}


function updateItem() {
    global $db, $db_table;

    try {
        // 게시글 데이터
        $data = json_decode(file_get_contents('php://input'), true);
        $category_uuid = $data['category_uuid'];
        $title = $data['title'];
        $content = $data['content'];
        $uuid = $data['uuid'];
        $video_type = $data['video_type'];
        $video_link = $data['video_link'];

        //DB업데이트
        $query = $db->prepare("UPDATE $db_table SET category_uuid = :category_uuid, title = :title, content = :content, video_type = :video_type, video_link = :video_link WHERE uuid = :uuid");
        $query->bindParam(':category_uuid', $category_uuid);
        $query->bindParam(':title', $title);
        $query->bindParam(':content', $content);
        $query->bindParam(':video_type', $video_type);
        $query->bindParam(':video_link', $video_link);
        $query->bindParam(':uuid', $uuid);
        $query->execute();
    } catch (Exception $e) {
        echo "updateItem에러 $e";
    }
}

function deleteItem($board_uuid) {
    global $db, $db_table;
    $query = $db->prepare("DELETE FROM $db_table WHERE uuid = :board_uuid");
    $query->bindParam(':board_uuid', $board_uuid);
    $query->execute();
}
