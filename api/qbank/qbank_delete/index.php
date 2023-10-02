<?php
require '../../config.php';
require 'functions.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'DELETE':
        if(isset($_GET['group_uuid'])) {
            $group_uuid = $_GET['group_uuid'];
            deleteGroup($group_uuid);
        }  
        break;
    default:
        http_response_code(405); // Method Not Allowed
        break;
}

?>