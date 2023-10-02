<?php
$db_table = "qbank_item";

function getItem($question_uuid) {
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

function createItem() {
    global $db, $db_table;
    
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $question_uuid = $data['question_uuid'];
        $group_uuid = $data['group_uuid'];
        $item_title = $data['item_title'];
        $item_key = $data['item_key'];

        $query = $db->prepare("INSERT INTO $db_table (question_uuid, group_uuid, item_title, item_key) VALUES (:question_uuid, :group_uuid, :item_title, :item_key)");
        $query->bindParam(':question_uuid', $question_uuid);
        $query->bindParam(':group_uuid', $group_uuid);
        $query->bindParam(':item_title', $item_title);
        $query->bindParam(':item_key', $item_key);
        $query->execute();
    } catch (Exception $e) {
        echo "createPost에러" . $e->getMessage();
    }
}


function updateItem() {
    global $db, $db_table;
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];
    $item_title = $data['item_title'];
    $item_key = $data['item_key'];

    $query = $db->prepare("UPDATE $db_table SET item_title = :item_title, item_key = :item_key WHERE id = :id");
    $query->bindParam(':id', $id);
    $query->bindParam(':item_title', $item_title);
    $query->bindParam(':item_key', $item_key);
    $query->execute();
}

function deleteItem($question_uuid) {
    global $db, $db_table;
    $query = $db->prepare("DELETE FROM $db_table WHERE question_uuid = :question_uuid");
    $query->bindParam(':question_uuid', $question_uuid);
    $query->execute();
}

?>