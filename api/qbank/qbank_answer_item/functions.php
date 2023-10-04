<?php
$db_table = "qbank_answer_item";

function getAnswerItem($answer_uuid) {
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

function createAnswerItem() {
    global $db, $db_table;
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $answer_uuid = $data['answer_uuid'];
        $answer = $data['answer'];
        $answer_key = $data['answer_key'];
        $question_uuid = $data['question_uuid'];
        $question_title = $data['question_title'];
      
        $query = $db->prepare("INSERT INTO $db_table (answer_uuid, answer, answer_key, question_uuid, question_title) VALUES (:answer_uuid, :answer, :answer_key, :question_uuid, :question_title)");
        $query->bindParam(':answer_uuid', $answer_uuid);
        $query->bindParam(':answer', $answer);
        $query->bindParam(':answer_key', $answer_key);
        $query->bindParam(':question_uuid', $question_uuid);
        $query->bindParam(':question_title', $question_title);
        $query->execute();
    } catch (Exception $e) {
        echo "createPost에러" . $e->getMessage();
    }
}

function updateAnswerItem($id) {
    global $db, $db_table;
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $id = $data['id'];
        $answer = $data['answer'];
        $answer_key = $data['answer_key'];
        $question_uuid = $data['question_uuid'];
        $question_title = $data['question_title'];

        $query = $db->prepare("UPDATE $db_table SET answer = :answer, answer_key = :answer_key, question_uuid = :question_uuid, question_title = :question_title WHERE id = :id");
        $query->bindParam(':question_title', $question_title);
        $query->bindParam(':answer', $answer);
        $query->bindParam(':answer_key', $answer_key);
        $query->bindParam(':question_uuid', $question_uuid);
        $query->bindParam(':question_title', $question_title);
        $query->bindParam(':id', $id);
        $query->execute();
    } catch (Exception $e) {
        echo "createPost에러" . $e->getMessage();
    }  
}


function deleteAnswerItem($id) {
    global $db, $db_table;
    $query = $db->prepare("DELETE FROM $db_table WHERE id = :id");
    $query->bindParam(':id', $id);
    $query->execute();
}

?>