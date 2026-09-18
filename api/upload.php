<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Certifique-se que esta pasta existe e tem permissão 755 ou 777
$target_dir = "../uploads/"; 
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0755, true);
}

// Check for 'file' or 'image' field
$uploadField = isset($_FILES['file']) ? 'file' : (isset($_FILES['image']) ? 'image' : null);

if ($uploadField) {
    // Generate unique name
    $extension = strtolower(pathinfo($_FILES[$uploadField]["name"], PATHINFO_EXTENSION));
    $newFileName = uniqid() . '.' . $extension;
    $target_file = $target_dir . $newFileName;
    
    // Allowed Mime Types
    $allowedMimeTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 
        'video/mp4', 'video/webm'
    ];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $_FILES[$uploadField]["tmp_name"]);
    finfo_close($finfo);

    if (!in_array($mimeType, $allowedMimeTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Tipo de arquivo não permitido: ' . $mimeType]);
        exit;
    }
    
    if (move_uploaded_file($_FILES[$uploadField]["tmp_name"], $target_file)) {
        $public_url = "uploads/" . $newFileName;
        echo json_encode(['url' => $public_url, 'type' => strpos($mimeType, 'video') === 0 ? 'video' : 'image']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao mover arquivo']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Nenhum arquivo enviado']);
}
?>
