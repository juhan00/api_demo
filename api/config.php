<?php
//   $host = "localhost";
//   $user = "root";
//   $pw = "limit1394@@";
//   $dbName = "api_test";

//   $db = new mysqli($host, $user, $pw, $dbName);

//   // if($conn){ echo "Connection established"."<br>"; }
//   if(!$db)  die( 'Could not connect: ' . mysqli_error($db) );


$host = 'localhost';
$dbname = 'apitest';
$username = 'root';
$password = 'limit1394@@';

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('Connection failed: ' . $e->getMessage());
}

?>