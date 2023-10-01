<?php
$db_table = "qbank_question";

function getQuestion($group_uuid) {
    global $db, $db_table;
    try {
        $query = $db->prepare("SELECT * FROM $db_table WHERE group_uuid = :group_uuid");
        $query->bindParam(':group_uuid', $group_uuid);
        $query->execute();
        $category = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($category);
    } catch (Exception $e) {
        echo "getAllCategory에러" . $e->getMessage();
    }
    
}

function createQuestion() {
    global $db, $db_table;
    try {
        $data = json_decode(file_get_contents('php://input'), true);
       
        $group_uuid = $data['group_uuid'];
        $question_uuid = $data['question_uuid'];
        $question_title = $data['question_title'];
        $items_count = $data['items_count'];
        $multiple_selection = $data['multiple_selection'];
        $subjective = $data['subjective'];
   
        $query = $db->prepare("INSERT INTO $db_table (group_uuid, question_uuid,question_title, items_count, multiple_selection, subjective, datetime) VALUES (:group_uuid, :question_uuid, :question_title, :items_count, :multiple_selection, :subjective, NOW())");
        $query->bindParam(':group_uuid', $group_uuid);
        $query->bindParam(':question_uuid', $question_uuid);
        $query->bindParam(':question_title', $question_title);
        $query->bindParam(':items_count', $items_count);
        $query->bindParam(':multiple_selection', $multiple_selection);
        $query->bindParam(':subjective', $subjective);
        $query->execute();
    } catch (Exception $e) {
        echo "createPost에러" . $e->getMessage();
    }
}


function updateQuestion() {
    global $db, $db_table;
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $id = $data['id'];
        $question_title = $data['question_title'];
        $items_count = $data['items_count'];
        $multiple_selection = $data['multiple_selection'];
        $subjective = $data['subjective'];

        $query = $db->prepare("UPDATE $db_table SET question_title = :question_title, items_count = :items_count, multiple_selection = :multiple_selection, subjective = :subjective, datetime = NOW() WHERE id = :id");
        $query->bindParam(':question_title', $question_title);
        $query->bindParam(':items_count', $items_count);
        $query->bindParam(':multiple_selection', $multiple_selection);
        $query->bindParam(':subjective', $subjective);
        $query->bindParam(':id', $id);
        $query->execute();
    } catch (Exception $e) {
        echo "createPost에러" . $e->getMessage();
    }

    
}

function deleteQuestion($question_id) {
    global $db, $db_table;
    $query = $db->prepare("DELETE FROM $db_table WHERE group_uuid = :group_uuid");
    $query->bindParam(':group_uuid', $question_id);
    $query->execute();
}

?>