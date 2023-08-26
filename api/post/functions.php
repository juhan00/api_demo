<?php
function getAllPosts() {
    global $db;
    $query = $db->query('SELECT * FROM posts');
    $posts = $query->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($posts);
    // exit;
    // foreach ($posts as &$post) {
    //     $post['comments'] = getComments($post['id']);
    // }

    // echo json_encode($posts);
}

function getPost($id) {
    global $db;
    $query = $db->prepare('SELECT * FROM posts WHERE id = :id');
    $query->bindParam(':id', $id);
    $query->execute();
    $post = $query->fetch(PDO::FETCH_ASSOC);

    echo json_encode($post);
    // if ($post) {
    //     $post['comments'] = getComments($post['id']);
    //     echo json_encode($post);
    // } else {
    //     http_response_code(404); // Not Found
    // }
}

// function createPost() {
//     global $db;
   
//     $data = json_decode(file_get_contents('php://input'), true);
//     $title = $data['title'];
//     $content = $data['content'];
//     $query = $db->prepare('INSERT INTO posts (title, content) VALUES (:title, :content)');
//     $query->bindParam(':title', $title);
//     $query->bindParam(':content', $content);
//     $query->execute();
// }

function createPost() {
    global $db;
    
    $upload_dir = '../../uploads/';

    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true); // 디렉토리가 없으면 생성
    }

    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $title = $data['title'];
        $content = $data['content'];
        $file_data = $data['file_data'];

        // 파일 업로드 부분을 처리
        foreach ($file_data as $file) {
            $file_name = $file['name'];
            // $fileSize = $file['size'];
            $file_content = base64_decode($file['content']);
        
            $destination = $upload_dir . $file_name;
            if (file_put_contents($destination, $file_content)) {
                echo "파일 '$file_name' 업로드 및 저장 완료\n";
            } else {
                echo "파일 '$file_name' 저장 실패\n";
            }
        }

    
        $query = $db->prepare('INSERT INTO posts (title, content, file_names) VALUES (:title, :content, :file_names)');
        $query->bindParam(':title', $title);
        $query->bindParam(':content', $content);
        $query->bindParam(':file_names', json_encode($file_data));
        $query->execute();
    } catch (Exception $e) {
        echo "createPost에러";
    }
}



function updatePost($id) {
    global $db;
    $data = json_decode(file_get_contents('php://input'), true);
    $title = $data['title'];
    $content = $data['content'];

    $query = $db->prepare('UPDATE posts SET title = :title, content = :content WHERE id = :id');
    $query->bindParam(':title', $title);
    $query->bindParam(':content', $content);
    $query->bindParam(':id', $id);
    $query->execute();
}

function deletePost($id) {
    global $db;
    $query = $db->prepare('DELETE FROM posts WHERE id = :id');
    $query->bindParam(':id', $id);
    $query->execute();
}

function getComments($post_id) {
    global $db;
    $query = $db->prepare('SELECT * FROM comments WHERE post_id = :post_id');
    $query->bindParam(':post_id', $post_id);
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
}

function createComment($post_id) {
    global $db;
    $data = json_decode(file_get_contents('php://input'), true);
    $content = $data['content'];

    $query = $db->prepare('INSERT INTO comments (post_id, content) VALUES (:post_id, :content)');
    $query->bindParam(':post_id', $post_id);
    $query->bindParam(':content', $content);
    $query->execute();
}
?>