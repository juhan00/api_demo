<?php
$db_table = "qbank_group";

function getGroup($group_uuid) {
    global $db, $db_table;
    try {
        $query = $db->prepare("SELECT * FROM $db_table WHERE group_uuid = :group_uuid");
        $query->bindParam(':group_uuid', $group_uuid);
        $query->execute();
        $data = $query->fetch(PDO::FETCH_ASSOC);
        echo json_encode($data);
    } catch (Exception $e) {
        echo "getAllCategory에러" . $e->getMessage();
    }   
}

function getGroupList() {
    global $db, $db_table;

    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $per_page = isset($_GET['per_page']) ? intval($_GET['per_page']) : 10;

    // 시작 레코드 위치 계산
    $start = ($page - 1) * $per_page;

    try {
        // 데이터 총 개수 조회 쿼리 생성
        $count_query = 'SELECT COUNT(*) FROM ' . $db_table;

        // 쿼리 실행 및 결과 가져오기
        $count_stmt = $db->prepare($count_query);
        $count_stmt->execute();
        $total_count = intval($count_stmt->fetchColumn());

        // 게시물 조회 쿼리 생성
        $query = 'SELECT * FROM ' . $db_table;
        $query .= " LIMIT $start, $per_page";

        // 쿼리 실행 및 결과 가져오기
        $stmt = $db->prepare($query);
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

function createGroup() {
    global $db, $db_table;
    
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $group_uuid = $data['group_uuid'];
        $group_title = $data['group_title'];
        $questions_count = $data['questions_count'];

        $query = $db->prepare("INSERT INTO $db_table (group_uuid, group_title, questions_count, datetime) VALUES (:group_uuid, :group_title, :questions_count, NOW())");
        $query->bindParam(':group_uuid', $group_uuid);
        $query->bindParam(':group_title', $group_title);
        $query->bindParam(':questions_count', $questions_count);
        $query->execute();
    } catch (Exception $e) {
        echo "createPost에러" . $e->getMessage();
    }
}


function updateGroup($group_id) {
    global $db, $db_table;
    $data = json_decode(file_get_contents('php://input'), true);
    $group_title = $data['group_title'];
    $questions_count = $data['questions_count'];

    $query = $db->prepare("UPDATE $db_table SET group_title = :group_title, questions_count = :questions_count, datetime = NOW() WHERE group_uuid = :group_uuid");
    $query->bindParam(':group_title', $group_title);
    $query->bindParam(':questions_count', $questions_count);
    $query->bindParam(':group_id', $group_id);
    $query->execute();
}

function deleteGroup($group_uuid) {
    global $db, $db_table;
    $query = $db->prepare("DELETE FROM $db_table WHERE group_uuid = :group_uuid");
    $query->bindParam(':group_uuid', $group_uuid);
    $query->execute();
}

?>