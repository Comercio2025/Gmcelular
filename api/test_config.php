<?php
// Ativar exibição de erros
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>Teste de Configuração</h1>";

echo "<p>Tentando incluir config.php...</p>";

try {
    require_once 'config.php';
    echo "<p style='color:green'>config.php incluído com sucesso!</p>";
} catch (Throwable $t) {
    echo "<p style='color:red'>Erro Fatal ao incluir config.php: " . $t->getMessage() . "</p>";
    echo "<pre>" . $t->getTraceAsString() . "</pre>";
    exit;
}

if (isset($pdo)) {
    echo "<p style='color:green'>Conexão PDO detectada!</p>";
    try {
        $status = $pdo->getAttribute(PDO::ATTR_CONNECTION_STATUS);
        echo "<p>Status da Conexão: $status</p>";
    } catch (Exception $e) {
        echo "<p style='color:red'>Erro ao verificar conexão: " . $e->getMessage() . "</p>";
    }
} else {
    echo "<p style='color:red'>Variável \$pdo não encontrada! Verifique o config.php</p>";
}

echo "<p>Se você chegou até aqui, não há erros de sintaxe fatais no config.php em si.</p>";
?>
