<?php
require_once __DIR__ . '/config.php';

// CORS preflight: respond early
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    jsonResponse(['ok' => true], 200);
}

$allowedResources = [
    'products' => 'products',
    'categories' => 'categories',
    'banners' => 'banners',
    'brands' => 'brands',
    'conditions' => 'conditions',
    'statuses' => 'statuses',
    'suppliers' => 'suppliers',
    'pages' => 'pages',
    'store_config' => 'store_config',
];

$resource = isset($_GET['resource']) ? $_GET['resource'] : null;
if (!$resource || !array_key_exists($resource, $allowedResources)) {
    jsonResponse(['error' => 'Invalid resource'], 400);
}

$table = $allowedResources[$resource];
$method = $_SERVER['REQUEST_METHOD'];

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

// Helper: get single id parameter
$id = isset($_GET['id']) ? $_GET['id'] : (isset($input['id']) ? $input['id'] : null);

try {
    if ($method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM `$table` WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            jsonResponse($row ?: null);
        } else {
            $stmt = $pdo->query("SELECT * FROM `$table`");
            $rows = $stmt->fetchAll();
            jsonResponse($rows);
        }
    }

    if ($method === 'POST') {
        // Create new item
        $new = $input;
        if (!isset($new['id'])) $new['id'] = $resource . '_' . uniqid();
        // Build insert
        $cols = array_keys($new);
        $placeholders = implode(',', array_fill(0, count($cols), '?'));
        $colList = implode(',', array_map(function($c){ return "`$c`"; }, $cols));
        $stmt = $pdo->prepare("INSERT INTO `$table` ($colList) VALUES ($placeholders)");
        $stmt->execute(array_values($new));
        jsonResponse($new, 201);
    }

    if ($method === 'PUT' || $method === 'PATCH') {
        if (!$id) jsonResponse(['error'=>'Missing id for update'], 400);
        $update = $input;
        unset($update['id']);
        $sets = implode(',', array_map(function($c){ return "`$c` = ?"; }, array_keys($update)));
        $values = array_values($update);
        $values[] = $id;
        $stmt = $pdo->prepare("UPDATE `$table` SET $sets WHERE id = ?");
        $stmt->execute($values);
        jsonResponse(['success' => true]);
    }

    if ($method === 'DELETE') {
        if (!$id) jsonResponse(['error'=>'Missing id for delete'], 400);
        $stmt = $pdo->prepare("DELETE FROM `$table` WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
    }

    // Fallback
    jsonResponse(['error' => 'Unsupported method'], 405);

} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
