<?php
// Configurações do Banco de Dados
// Configurações do Banco de Dados
// PREFRÊNCIA: LOCALHOST (Comente para usar remoto)
define('DB_HOST', 'localhost');
define('DB_USER', 'gmso3652_teste');
define('DB_PASS', 'zUt6kO7,=&mwvvcK'); // Senha padrão XAMPP/WAMP é vazia, MAMP é 'root'
define('DB_NAME', 'gmso3652_celular');

if (file_exists(__DIR__ . '/secrets.php')) {
    include_once __DIR__ . '/secrets.php';
}
if (!defined('GEMINI_API_KEY')) {
    define('GEMINI_API_KEY', getenv('GEMINI_API_KEY') ?: '');
}

// ONLINE (Descomente para usar em produção)
// define('DB_HOST', 'localhost');
// define('DB_USER', 'gmso3652_teste');
// define('DB_PASS', 'zUt6kO7,=&mwvvcK');
// define('DB_NAME', 'gmso3652_celular');


// Conexão PDO
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Em produção, comente a linha abaixo e descomente a seguinte para segurança
     die("Erro de conexão (Debug): " . $e->getMessage());
    // die("Erro de conexão com o banco de dados.");
}

// Cabeçalhos CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
