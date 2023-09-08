<?php
require '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$config = json_decode(file_get_contents('config.json'), true);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';


switch ($method) {
    case 'POST':  
        try {
            // PHPMailer 인스턴스 생성
            $mail = new PHPMailer(true);
            
            // SMTP 설정
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'jvabya@gmail.com'; // Gmail 계정 이메일
            $mail->Password   = $config['gmail_app_password']; // Gmail 앱 비밀번호 (또는 계정 비밀번호)
    
            // 메일 설정
            $mail->CharSet = 'UTF-8';
            $mail->setFrom('jvabya@gmail.com', '플랜디브'); // 발신자 이메일 주소 및 이름
            $mail->addAddress('jvabya@gmail.com', '플랜디브'); // 수신자 이메일 주소 및 이름
    
            // 이메일 본문
            $mail->isHTML(true); // HTML 형식으로 이메일을 보낼 경우 true로 설정
            $mail->Subject = '프로젝트 문의: ' . $_POST['name'];
            $mail->Body    = "<h1>프로젝트 문의</h1>
                            <p><strong>프로젝트:</strong> {$_POST['project']}</p>
                            <p><strong>이름:</strong> {$_POST['name']}</p>
                            <p><strong>전화번호:</strong> {$_POST['phone']}</p>
                            <p><strong>이메일:</strong> {$_POST['email']}</p>
                            <p><strong>개인정보 수집 및 이용동의:</strong> {$_POST['agreement']}</p>";
    
            // 메일 보내기
            $mail->send();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $mail->ErrorInfo]);
        }

        break;
    default:
        http_response_code(405); // Method Not Allowed
        break;
}

?>