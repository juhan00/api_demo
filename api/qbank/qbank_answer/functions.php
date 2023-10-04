<?php
$db_table = "qbank_answer";

function getAnswer($answer_uuid) {
    global $db, $db_table;
    try {
        $query = $db->prepare("SELECT * FROM $db_table WHERE answer_uuid = :answer_uuid");
        $query->bindParam(':answer_uuid', $answer_uuid);
        $query->execute();
        $data = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    } catch (Exception $e) {
        echo "getAllCategory에러" . $e->getMessage();
    }
}

function getAnswerList() {
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
        $query .= ' ORDER BY datetime DESC LIMIT ' . $start . ', ' . $per_page;

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

function createAnswer() {
    global $db, $db_table;  
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $group_uuid = $data['group_uuid'];  
        $group_title = $data['group_title'];  
        $answer_uuid = $data['answer_uuid'];
      
        $query = $db->prepare("INSERT INTO $db_table (group_uuid, group_title, answer_uuid, datetime) VALUES (:group_uuid,:group_title, :answer_uuid, NOW())");
        $query->bindParam(':group_uuid', $group_uuid);
        $query->bindParam(':group_title', $group_title);
        $query->bindParam(':answer_uuid', $answer_uuid);
        $query->execute();
    } catch (Exception $e) {
        echo "createPost에러" . $e->getMessage();
    }
}

function updateAnswer($answer_uuid) {
    global $db, $db_table;
    try {
        $data = json_decode(file_get_contents('php://input'), true); 
        $group_uuid = $data['group_uuid'];  
        $group_title = $data['group_title']; 
        $answer_uuid = $data['answer_uuid'];

        $query = $db->prepare("UPDATE $db_table SET group_uuid = :group_uuid, group_title = :group_title, datetime = NOW() WHERE answer_uuid = :answer_uuid");
        $query->bindParam(':group_uuid', $group_uuid);
        $query->bindParam(':group_title', $group_title);
        $query->execute();
    } catch (Exception $e) {
        echo "createPost에러" . $e->getMessage();
    }  
}


function deleteAnswer($question_uuid) {
    global $db, $db_table;
    $query = $db->prepare("DELETE FROM $db_table WHERE question_uuid = :question_uuid");
    $query->bindParam(':question_uuid', $question_uuid);
    $query->execute();
}

?>