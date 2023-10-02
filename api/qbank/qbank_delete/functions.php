<?php
$db_table_group = "qbank_group";
$db_table_question = "qbank_question";
$db_table_item = "qbank_item";

function deleteGroup($group_uuid) {
    global $db, $db_table_group, $db_table_question, $db_table_item;

    // 테이블 이름 배열 생성
    $tables = array($db_table_group, $db_table_question, $db_table_item);
    
    // 각 테이블에서 group_uuid를 기준으로 삭제
    foreach ($tables as $table) {
        $query = $db->prepare("DELETE FROM $table WHERE group_uuid = :group_uuid");
        $query->bindParam(':group_uuid', $group_uuid);
        $query->execute();
    }
}

?>