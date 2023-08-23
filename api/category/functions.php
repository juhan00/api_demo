<?php
$db_board = "category";

function getCategory($board_name) {
    global $db, $db_board;
    try {
        $query = $db->prepare('SELECT * FROM '. $db_board .' WHERE board_name = :board_name');
        $query->bindParam(':board_name', $board_name);
        $query->execute();
        $category = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($category);
    } catch (Exception $e) {
        echo "getAllCategory에러" . $e->getMessage();
    }
    
}

function createCategory() {
    global $db, $db_board;
    
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $data['name'];
        $board_name = $data['board_name'];
        $category_id = $data['category_id'];

        $query = $db->prepare('INSERT INTO '. $db_board .' (name, board_name, datetime, category_id) VALUES (:name, :board_name, NOW(), :category_id)');
        $query->bindParam(':name', $name);
        $query->bindParam(':board_name', $board_name);
        $query->bindParam(':category_id', $category_id);
        $query->execute();
    } catch (Exception $e) {
        echo "createPost에러" . $e->getMessage();
    }
}


function updateCategory($category_id) {
    global $db, $db_board;
    $data = json_decode(file_get_contents('php://input'), true);
    $name = $data['name'];

    $query = $db->prepare('UPDATE '. $db_board .' SET name = :name, datetime = NOW() WHERE category_id = :category_id');
    $query->bindParam(':category_id', $category_id);
    $query->bindParam(':name', $name);
    $query->execute();
}

function deleteCategory($category_id) {
    global $db, $db_board;
    $query = $db->prepare('DELETE FROM '. $db_board .' WHERE category_id = :category_id');
    $query->bindParam(':category_id', $category_id);
    $query->execute();
}

?>