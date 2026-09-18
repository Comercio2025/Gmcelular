<?php
require_once 'config.php';

try {
    $sql = file_get_contents('schema.sql');
    $pdo->exec($sql);
    echo "Database setup completed successfully. Tables created/updated.";
} catch (PDOException $e) {
    echo "Error setting up database: " . $e->getMessage();
}
?>
