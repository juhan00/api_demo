<?php
$db_table = "qbank_answer";

function getAnswer($question_uuid) {
    global $db, $db_table;
    try {
        $query = $db->prepare("SELECT * FROM $db_table WHERE question_uuid = :question_uuid");
        $query->bindParam(':question_uuid', $question_uuid);
        $query->execute();
        $data = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    } catch (Exception $e) {
        echo "getAllCategory에러" . $e->getMessage();
    }
    
}

function createAnswer() {
    global $db, $db_table;
    
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $answer_uuid = $data['answer_uuid'];
        $question_uuid = $data['question_uuid'];
        $group_uuid = $data['group_uuid'];
        $question_title = $data['question_title'];
        $answer = $data['answer'];
        $answer_key = $data['answer_key'];
      
        $query = $db->prepare("INSERT INTO $db_table (answer_uuid, question_uuid, group_uuid, question_title, answer, answer_key, datetime) VALUES (:answer_uuid, :question_uuid, :group_uuid, :question_title, :answer, :answer_key, NOW())");
        $query->bindParam(':answer_uuid', $answer_uuid);
        $query->bindParam(':question_uuid', $question_uuid);
        $query->bindParam(':group_uuid', $group_uuid);
        $query->bindParam(':question_title', $question_title);
        $query->bindParam(':answer', $answer);
        $query->bindParam(':answer_key', $answer_key);
        $query->execute();
    } catch (Exception $e) {
        echo "createPost에러" . $e->getMessage();
    }
}

function updateAnswer() {
    global $db, $db_table;
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $id = $data['id'];
        $question_title = $data['question_title'];
        $answer = $data['answer'];
        $answer_key = $data['answer_key'];

        $query = $db->prepare("UPDATE $db_table SET question_title = :question_title, answer = :answer, answer_key = :answer_key, datetime = NOW() WHERE id = :id");
        $query->bindParam(':question_title', $question_title);
        $query->bindParam(':answer', $answer);
        $query->bindParam(':answer_key', $answer_key);
        $query->bindParam(':id', $id);
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