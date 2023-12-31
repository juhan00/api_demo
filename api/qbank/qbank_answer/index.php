<?php
require '../../config.php';
require 'functions.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if(isset($_GET['answer_uuid'])) {
            $answer_uuid = $_GET['answer_uuid'];
            getAnswer($answer_uuid);
        } else{
            getAnswerList();
        }
        break;
    case 'POST':  
        createAnswer();
        break;
    case 'PUT':
        if(isset($_GET['answer_uuid'])) {
            $answer_uuid = $_GET['answer_uuid'];
            updateAnswer($answer_uuid);
        }
        break;
    case 'DELETE':
        if(isset($_GET['answer_uuid'])) {
            $answer_uuid = $_GET['answer_uuid'];
            deleteAnswer($answer_uuid);
        }
        break;
    default:
        http_response_code(405); // Method Not Allowed
        break;
}

?>