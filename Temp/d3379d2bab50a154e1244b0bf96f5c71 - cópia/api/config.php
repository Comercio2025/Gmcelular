<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration - use environment variables or edit this file on server
// IMPORTANT: avoid committing production credentials. Use `api/config.example.php` as a template.
$DB_HOST = getenv('DB_HOST') ?: 'localhost';
$DB_NAME = getenv('DB_NAME') ?: 'gmso3652_gmcel';
$DB_USER = getenv('DB_USER') ?: 'gmso3652_gmcell';
$DB_PASS = getenv('DB_PASS') ?: 'VDIoFf04}of.X0Y[';
$DB_PORT = getenv('DB_PORT') ?: '3306';

// Allow host:port in DB_HOST; split if present
if (strpos($DB_HOST, ':') !== false) {
    [$parsedHost, $parsedPort] = explode(':', $DB_HOST, 2);
    if (!empty($parsedHost)) $DB_HOST = $parsedHost;
    if (!empty($parsedPort)) $DB_PORT = $parsedPort;
}

try {
    $pdo = new PDO("mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed', 'message' => $e->getMessage()]);
    exit;
}

function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

?>
