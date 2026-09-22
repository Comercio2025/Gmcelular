<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
// Get action from query string or body
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Helper to return JSON
function jsonResponse($data, $status = 200)
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function slugify($text)
{
    $text = strtolower(trim((string) $text));
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    $text = trim((string) $text, '-');
    return $text !== '' ? $text : 'artigo-' . time();
}

function getStoreConfigValue($pdo, $key, $default = '')
{
    try {
        $stmt = $pdo->prepare("SELECT config_value FROM store_config WHERE config_key = ? LIMIT 1");
        $stmt->execute([$key]);
        $value = $stmt->fetchColumn();
        if ($value === false || $value === null || $value === '') return $default;
        return $value;
    } catch (Exception $e) {
        return $default;
    }
}

function extractJsonFromText($text)
{
    $text = trim((string) $text);
    $cleaned = preg_replace('/^```(?:json)?\s*/i', '', $text);
    $cleaned = preg_replace('/\s*```$/', '', $cleaned);
    $decoded = json_decode($cleaned, true);
    if (is_array($decoded)) return $decoded;

    if (preg_match('/\{[\s\S]*\}/', $cleaned, $matches)) {
        $candidate = $matches[0];
        $decoded = json_decode($candidate, true);
        if (is_array($decoded)) return $decoded;
    }

    return null;
}

function callGeminiGenerate($prompt, $apiKey, $model = 'gemini-2.5-flash')
{
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/' . rawurlencode($model) . ':generateContent';
    $payload = [
        'contents' => [[
            'role' => 'user',
            'parts' => [[
                'text' => $prompt
            ]]
        ]],
        'generationConfig' => [
            'temperature' => 0.5,
            'responseMimeType' => 'application/json'
        ]
    ];

    $jsonBody = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($jsonBody === false) {
        throw new Exception('Falha ao criar payload da IA.');
    }

    $responseBody = '';
    $httpStatus = 0;

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        if ($ch === false) throw new Exception('Falha ao inicializar cURL.');

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'x-goog-api-key: ' . $apiKey
            ],
            CURLOPT_POSTFIELDS => $jsonBody,
            CURLOPT_TIMEOUT => 40,
            CURLOPT_CONNECTTIMEOUT => 8
        ]);

        $raw = curl_exec($ch);
        if ($raw === false) {
            $error = curl_error($ch);
            curl_close($ch);
            throw new Exception('Erro ao comunicar com Gemini: ' . $error);
        }

        $responseBody = (string) $raw;
        $httpStatus = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
    } else {
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/json\r\nx-goog-api-key: {$apiKey}\r\n",
                'content' => $jsonBody,
                'timeout' => 40,
                'ignore_errors' => true,
            ]
        ]);

        $raw = file_get_contents($url, false, $context);
        if ($raw === false) throw new Exception('Erro ao comunicar com Gemini.');

        $responseBody = (string) $raw;
        $headers = $http_response_header ?? [];
        foreach ($headers as $line) {
            if (preg_match('/^HTTP\\/\\S+\\s+(\\d{3})/', (string) $line, $matches)) {
                $httpStatus = (int) $matches[1];
                break;
            }
        }
    }

    $decoded = json_decode($responseBody, true);
    if (!is_array($decoded)) {
        throw new Exception('Resposta inválida da IA.');
    }
    if ($httpStatus >= 400 || isset($decoded['error'])) {
        $message = $decoded['error']['message'] ?? 'Falha no Gemini.';
        throw new Exception($message);
    }

    $text = $decoded['candidates'][0]['content']['parts'][0]['text'] ?? '';
    if (!$text) throw new Exception('A IA não retornou conteúdo.');

    $data = extractJsonFromText($text);
    if (!is_array($data)) throw new Exception('Não foi possível interpretar JSON retornado pela IA.');

    return $data;
}

// --- GET Request ---
if ($method === 'GET') {
    try {
        if ($action === 'data_sync') {
            // AUTO-MIGRATION: Ensure banners table exists
            $pdo->exec("CREATE TABLE IF NOT EXISTS banners (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255),
                image_url TEXT NOT NULL,
                link TEXT,
                active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )");

            // AUTO-MIGRATION: Ensure products table exists and has correct schema
            $pdo->exec("CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                cost_price DECIMAL(10,2) DEFAULT 0,
                image_url LONGTEXT,
                category_id INT,
                brand_id INT,
                model VARCHAR(100),
                condition_id INT,
                status_id INT,
                active BOOLEAN DEFAULT TRUE,
                stock INT DEFAULT 0,
                featured BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )");

            // AUTO-MIGRATION: Ensure correct status names and slugs
            try {
                // Rename 'Ativo' to 'Em estoque' and 'Inativo'/'on_order' to 'Por encomenda'
                $pdo->exec("UPDATE product_statuses SET name = 'Em estoque', slug = 'em_estoque' WHERE slug IN ('active', 'ativo')");
                $pdo->exec("UPDATE product_statuses SET name = 'Por encomenda', slug = 'por_encomenda' WHERE slug IN ('on_order', 'inactive', 'inativo')");

                // If they don't exist, we might need to insert them? 
                // Let's ensure at least these two exist
                $check = $pdo->query("SELECT COUNT(*) FROM product_statuses WHERE slug = 'em_estoque'")->fetchColumn();
                if ($check == 0) {
                    $pdo->exec("INSERT INTO product_statuses (name, slug, color) VALUES ('Em estoque', 'em_estoque', 'green')");
                }
                $check = $pdo->query("SELECT COUNT(*) FROM product_statuses WHERE slug = 'por_encomenda'")->fetchColumn();
                if ($check == 0) {
                    $pdo->exec("INSERT INTO product_statuses (name, slug, color) VALUES ('Por encomenda', 'por_encomenda', 'orange')");
                }
            } catch (Exception $e) {
            }

            // AUTO-MIGRATION: Ensure pages table exists
            $pdo->exec("CREATE TABLE IF NOT EXISTS pages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL,
                content LONGTEXT,
                external_link TEXT,
                active BOOLEAN DEFAULT TRUE,
                order_index INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )");

            // AUTO-MIGRATION: Ensure custom_filters table exists
            $pdo->exec("CREATE TABLE IF NOT EXISTS custom_filters (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                criteria LONGTEXT, -- JSON
                active TINYINT(1) DEFAULT 1,
                order_index INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )");

            // AUTO-MIGRATION: Ensure articles table exists
            $pdo->exec("CREATE TABLE IF NOT EXISTS articles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL,
                excerpt TEXT,
                content LONGTEXT,
                cover_image_url LONGTEXT,
                tags TEXT,
                active TINYINT(1) DEFAULT 1,
                order_index INT DEFAULT 0,
                published_at DATETIME NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )");

            // Ensure image_url can hold Base64 (LONGTEXT) and active column exists
            try {
                $pdo->exec("ALTER TABLE products MODIFY image_url LONGTEXT");
            } catch (Exception $e) {
            }
            try {
                $pdo->exec("ALTER TABLE products ADD COLUMN active BOOLEAN DEFAULT TRUE AFTER status_id");
            } catch (Exception $e) {
            }

            // AUTO-MIGRATION: Ensure pages has external_link and background_color
            try {
                $pdo->exec("ALTER TABLE pages ADD COLUMN external_link TEXT");
            } catch (Exception $e) {
            }
            try {
                $pdo->exec("ALTER TABLE pages ADD COLUMN background_color VARCHAR(50) DEFAULT '#020c1b'");
            } catch (Exception $e) {
            }

            // Fetch ALL data for initial sync
            $data = [
                'products' => $pdo->query("SELECT p.*, c.name as category_name, b.name as brand_name, cond.name as condition_name, s.slug as status_slug 
                                           FROM products p 
                                           LEFT JOIN categories c ON p.category_id = c.id
                                           LEFT JOIN brands b ON p.brand_id = b.id
                                           LEFT JOIN conditions cond ON p.condition_id = cond.id
                                           LEFT JOIN product_statuses s ON p.status_id = s.id
                                           ORDER BY p.id DESC")->fetchAll(),
                'categories' => $pdo->query("SELECT * FROM categories ORDER BY name")->fetchAll(),
                'brands' => $pdo->query("SELECT * FROM brands ORDER BY name")->fetchAll(),
                'conditions' => $pdo->query("SELECT * FROM conditions ORDER BY id")->fetchAll(),
                'statuses' => $pdo->query("SELECT * FROM product_statuses ORDER BY id")->fetchAll(),
                'banners' => $pdo->query("SELECT * FROM banners ORDER BY id DESC")->fetchAll(),
                'pages' => $pdo->query("SELECT * FROM pages ORDER BY order_index ASC")->fetchAll(), // Now includes all columns
                'filters' => $pdo->query("SELECT * FROM custom_filters ORDER BY order_index ASC")->fetchAll(),
                'articles' => $pdo->query("SELECT * FROM articles ORDER BY order_index DESC, id DESC")->fetchAll(),
                'config' => (function() use ($pdo) {
                    $c = $pdo->query("SELECT config_key, config_value FROM store_config")->fetchAll(PDO::FETCH_KEY_PAIR);
                    if (empty($c['geminiApiKey']) && defined('GEMINI_API_KEY') && GEMINI_API_KEY !== '') {
                        $c['geminiApiKey'] = GEMINI_API_KEY;
                    }
                    if (empty($c['geminiModel'])) {
                        $c['geminiModel'] = 'gemini-2.5-flash';
                    }
                    return $c;
                })()
            ];
            jsonResponse($data);
        }
    } catch (Exception $e) {
        jsonResponse(['error' => $e->getMessage()], 500);
    }
}

// --- POST Request ---
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    // If action not in GET, check body (sometimes useful)
    if (!$action && isset($input['action'])) $action = $input['action'];

    if (!$action) jsonResponse(['error' => 'No action specified'], 400);

    try {
        switch ($action) {
            // --- PAGES (CMS) ---
            case 'save_page':
                $id = $input['id'] ?? null;
                $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $input['title'])));

                $sql = "INSERT INTO pages (title, slug, content, external_link, background_color, active, order_index) VALUES (:title, :slug, :content, :external_link, :background_color, :active, :order_index)";
                if ($id) {
                    $sql = "UPDATE pages SET title=:title, slug=:slug, content=:content, external_link=:external_link, background_color=:background_color, active=:active, order_index=:order_index WHERE id=:id";
                }

                $stmt = $pdo->prepare($sql);
                $params = [
                    ':title' => $input['title'],
                    ':slug' => $input['slug'] ?? $slug,
                    ':content' => $input['content'] ?? null, // HTML/JSON content
                    ':external_link' => $input['externalLink'] ?? null,
                    ':background_color' => $input['backgroundColor'] ?? '#020c1b',
                    ':active' => $input['active'] ? 1 : 0,
                    ':order_index' => $input['orderIndex'] ?? 0
                ];
                if ($id) $params[':id'] = $id;

                $stmt->execute($params);
                jsonResponse(['success' => true, 'id' => $id ? $id : $pdo->lastInsertId()]);
                break;

            case 'delete_page':
                $stmt = $pdo->prepare("DELETE FROM pages WHERE id = ?");
                $stmt->execute([$input['id']]);
                jsonResponse(['success' => true]);
                break;

            // --- CONFIG ---
            case 'save_config':
                $config = $input['config']; // Expecting object
                foreach ($config as $key => $value) {
                    // Handle JSON arrays (like socialMedia)
                    if (is_array($value)) {
                        $value = json_encode($value);
                    }

                    // Upsert
                    $stmt = $pdo->prepare("INSERT INTO store_config (config_key, config_value) VALUES (:key, :value) ON DUPLICATE KEY UPDATE config_value = :value");
                    $stmt->execute([':key' => $key, ':value' => $value]);
                }
                jsonResponse(['success' => true]);
                break;

                jsonResponse(['success' => true]);
                break;

            // --- FILTERS ---
            case 'save_filter':
                $name = $input['name'];
                $criteria = is_array($input['criteria']) ? json_encode($input['criteria']) : $input['criteria'];
                $active = $input['active'] ?? 1;
                $orderIndex = $input['orderIndex'] ?? 0;

                if (isset($input['id'])) {
                    $stmt = $pdo->prepare("UPDATE custom_filters SET name=?, criteria=?, active=?, order_index=? WHERE id=?");
                    $stmt->execute([$name, $criteria, $active, $orderIndex, $input['id']]);
                } else {
                    $stmt = $pdo->prepare("INSERT INTO custom_filters (name, criteria, active, order_index) VALUES (?, ?, ?, ?)");
                    $stmt->execute([$name, $criteria, $active, $orderIndex]);
                }
                jsonResponse(['success' => true]);
                break;

            case 'delete_filter':
                $stmt = $pdo->prepare("DELETE FROM custom_filters WHERE id=?");
                $stmt->execute([$input['id']]);
                jsonResponse(['success' => true]);
                break;

            // --- BANNERS ---
            case 'save_banner':
                $id = $input['id'] ?? null;
                $sql = "INSERT INTO banners (title, image_url, link, active) VALUES (:title, :image_url, :link, :active)";
                if ($id) {
                    $sql = "UPDATE banners SET title=:title, image_url=:image_url, link=:link, active=:active WHERE id=:id";
                }

                $stmt = $pdo->prepare($sql);
                $params = [
                    ':title' => $input['title'] ?? '',
                    ':image_url' => $input['imageUrl'], // Frontend uses camelCase
                    ':link' => $input['link'] ?? '',
                    ':active' => $input['active'] ? 1 : 0
                ];
                if ($id) $params[':id'] = $id;

                $stmt->execute($params);
                jsonResponse(['success' => true, 'id' => $id ? $id : $pdo->lastInsertId()]);
                break;

            case 'delete_banner':
                $stmt = $pdo->prepare("DELETE FROM banners WHERE id = ?");
                $stmt->execute([$input['id']]);
                jsonResponse(['success' => true]);
                break;

            // --- PRODUCTS ---
            case 'save_product':
                $id = $input['id'] ?? null;
                // NOTE: We are receiving names/IDs mixed? Frontend sends IDs or objects?
                // For this implementation, we assume frontend sends IDs for foreign keys OR we map matches.
                // Simplified: Frontend needs to send IDs. We will update frontend to send IDs.

                // SMART SAVE: Check if ID really exists
                if ($id) {
                    $check = $pdo->prepare("SELECT id FROM products WHERE id = ?");
                    $check->execute([$id]);
                    if (!$check->fetch()) {
                        $id = null; // ID not found (likely a frontend temp ID), force INSERT
                    }
                }

                $sql = "INSERT INTO products (name, description, price, cost_price, image_url, category_id, brand_id, model, condition_id, status_id, active, stock, featured) 
                        VALUES (:name, :description, :price, :cost_price, :image_url, :category_id, :brand_id, :model, :condition_id, :status_id, :active, :stock, :featured)";

                if ($id) {
                    $sql = "UPDATE products SET name=:name, description=:description, price=:price, cost_price=:cost_price, image_url=:image_url, 
                            category_id=:category_id, brand_id=:brand_id, model=:model, condition_id=:condition_id, status_id=:status_id, active=:active, stock=:stock, featured=:featured 
                            WHERE id=:id";
                }

                $stmt = $pdo->prepare($sql);
                $params = [
                    ':name' => $input['name'],
                    ':description' => $input['description'] ?? '',
                    ':price' => $input['price'],
                    ':cost_price' => $input['costPrice'] ?? 0,
                    ':image_url' => $input['imageUrl'] ?? '',
                    ':category_id' => $input['category_id'] ?? null, // Expecting ID
                    ':brand_id' => $input['brand_id'] ?? null,       // Expecting ID
                    ':model' => $input['model'] ?? '',
                    ':condition_id' => $input['condition_id'] ?? null, // Expecting ID
                    ':status_id' => $input['status_id'] ?? null,     // Expecting ID
                    ':active' => isset($input['active']) ? ($input['active'] ? 1 : 0) : 1,
                    ':stock' => $input['stock'] ?? 1,
                    ':featured' => isset($input['featured']) && $input['featured'] ? 1 : 0
                ];
                if ($id) $params[':id'] = $id;

                $stmt->execute($params);
                jsonResponse(['success' => true, 'id' => $id ? $id : $pdo->lastInsertId()]);
                break;

            case 'delete_product':
                $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
                $stmt->execute([$input['id']]);
                jsonResponse(['success' => true]);
                break;

            // --- GENERIC GENERIC (Brand, Category, etc) ---
            case 'save_entity':
                $table = $input['entity']; // 'brands', 'categories', etc.
                // Whitelist tables
                if (!in_array($table, ['categories', 'brands', 'conditions', 'product_statuses'])) {
                    jsonResponse(['error' => 'Invalid entity'], 400);
                }

                $id = $input['id'] ?? null;

                // SMART SAVE: Check if ID really exists
                if ($id && is_numeric($id)) {
                    $check = $pdo->prepare("SELECT id FROM $table WHERE id = ?");
                    $check->execute([$id]);
                    if (!$check->fetch()) {
                        $id = null; // ID not found (likely a frontend temp ID), force INSERT
                    }
                }

                if ($id && is_numeric($id)) { // Update
                    $sql = "UPDATE $table SET name = :name, slug = :slug";
                    if ($table === 'product_statuses') $sql .= ", color = :color";
                    $sql .= " WHERE id = :id";
                } else { // Insert
                    $sql = "INSERT INTO $table (name, slug";
                    if ($table === 'product_statuses') $sql .= ", color";
                    $sql .= ") VALUES (:name, :slug";
                    if ($table === 'product_statuses') $sql .= ", :color";
                    $sql .= ")";
                }

                $stmt = $pdo->prepare($sql);
                $params = [':name' => $input['name'], ':slug' => $input['slug'] ?? strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $input['name'])))];
                if ($table === 'product_statuses') $params[':color'] = $input['color'] ?? 'blue';
                if ($id && is_numeric($id)) $params[':id'] = $id;

                $stmt->execute($params);
                jsonResponse(['success' => true, 'id' => $id ? $id : $pdo->lastInsertId()]);
                break;

            case 'delete_entity':
                $table = $input['entity'];
                if (!in_array($table, ['categories', 'brands', 'conditions', 'product_statuses'])) {
                    jsonResponse(['error' => 'Invalid entity'], 400);
                }
                $stmt = $pdo->prepare("DELETE FROM $table WHERE id = ?");
                $stmt->execute([$input['id']]);
                jsonResponse(['success' => true]);
                break;

            // --- BULK OPERATIONS ---
            case 'bulk_delete_products':
                if (empty($input['ids']) || !is_array($input['ids'])) {
                    jsonResponse(['error' => 'Invalid IDs'], 400);
                }
                // Use default place holders
                $ids = $input['ids'];
                $placeholders = str_repeat('?,', count($ids) - 1) . '?';
                $stmt = $pdo->prepare("DELETE FROM products WHERE id IN ($placeholders)");
                $stmt->execute($ids);
                jsonResponse(['success' => true]);
                break;

            case 'bulk_update_products':
                if (empty($input['ids']) || !is_array($input['ids'])) {
                    jsonResponse(['error' => 'Invalid IDs'], 400);
                }
                $ids = $input['ids'];
                $updates = $input['updates'] ?? [];

                // Build dynamic update query
                $setParts = [];
                $params = [];

                // Allowed fields for bulk update
                $allowed = ['price', 'stock', 'status_id', 'condition_id', 'category_id', 'brand_id', 'active'];

                foreach ($updates as $key => $value) {
                    if (in_array($key, $allowed)) {
                        $setParts[] = "$key = ?";
                        $params[] = $value;
                    }
                }

                if (empty($setParts)) jsonResponse(['error' => 'No valid updates'], 400);

                $placeholders = str_repeat('?,', count($ids) - 1) . '?';
                $sql = "UPDATE products SET " . implode(', ', $setParts) . " WHERE id IN ($placeholders)";

                // Merge params with IDs
                $params = array_merge($params, $ids);

                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                jsonResponse(['success' => true]);
                break;

            // --- ARTICLES ---
            case 'save_article':
                $id = $input['id'] ?? null;
                $title = trim((string) ($input['title'] ?? ''));
                if ($title === '') jsonResponse(['error' => 'Título é obrigatório'], 400);

                $slug = trim((string) ($input['slug'] ?? ''));
                if ($slug === '') $slug = slugify($title);

                $sql = "INSERT INTO articles (title, slug, excerpt, content, cover_image_url, tags, active, order_index, published_at)
                        VALUES (:title, :slug, :excerpt, :content, :cover_image_url, :tags, :active, :order_index, :published_at)";
                if ($id) {
                    $sql = "UPDATE articles SET
                                title = :title,
                                slug = :slug,
                                excerpt = :excerpt,
                                content = :content,
                                cover_image_url = :cover_image_url,
                                tags = :tags,
                                active = :active,
                                order_index = :order_index,
                                published_at = :published_at
                            WHERE id = :id";
                }

                $stmt = $pdo->prepare($sql);
                $params = [
                    ':title' => $title,
                    ':slug' => $slug,
                    ':excerpt' => $input['excerpt'] ?? '',
                    ':content' => $input['content'] ?? '',
                    ':cover_image_url' => $input['coverImageUrl'] ?? '',
                    ':tags' => $input['tags'] ?? '',
                    ':active' => isset($input['active']) && $input['active'] ? 1 : 0,
                    ':order_index' => (int) ($input['orderIndex'] ?? 0),
                    ':published_at' => !empty($input['publishedAt']) ? date('Y-m-d H:i:s', strtotime((string) $input['publishedAt'])) : null,
                ];
                if ($id) $params[':id'] = $id;
                $stmt->execute($params);

                jsonResponse(['success' => true, 'id' => $id ?: $pdo->lastInsertId()]);
                break;

            case 'delete_article':
                $stmt = $pdo->prepare("DELETE FROM articles WHERE id = ?");
                $stmt->execute([$input['id'] ?? 0]);
                jsonResponse(['success' => true]);
                break;

            case 'recommend_smartphones_ai':
                $profile = $input['profile'] ?? null;
                $candidates = $input['candidates'] ?? null;
                if (!is_array($profile) || !is_array($candidates) || count($candidates) === 0) {
                    jsonResponse(['error' => 'Dados de recomendação inválidos.'], 400);
                }

                if (count($candidates) > 12) {
                    $candidates = array_slice($candidates, 0, 12);
                }

                $apiKey = trim((string) getStoreConfigValue($pdo, 'geminiApiKey', ''));
                if ($apiKey === '') {
                    $apiKey = defined('GEMINI_API_KEY') ? trim((string) GEMINI_API_KEY) : '';
                }
                if ($apiKey === '') {
                    jsonResponse(['error' => 'Gemini API Key não configurada para recomendação.'], 400);
                }

                $model = trim((string) getStoreConfigValue($pdo, 'geminiModel', 'gemini-2.5-flash'));
                if ($model === '') $model = 'gemini-2.5-flash';

                $customPrompt = trim((string) getStoreConfigValue($pdo, 'geminiRecommenderPrompt', ''));
                if ($customPrompt === '') {
                    $customPrompt = 'Priorize custo-benefício real dentro do orçamento, equilibrando uso principal, confiabilidade e clareza da justificativa comercial.';
                }

                $profileJson = json_encode($profile, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                $candidatesJson = json_encode($candidates, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                if ($profileJson === false || $candidatesJson === false) {
                    jsonResponse(['error' => 'Falha ao preparar dados para IA.'], 500);
                }

                $prompt = <<<PROMPT
Você é especialista em recomendação de smartphones para varejo brasileiro.

Objetivo:
- Classificar os melhores aparelhos para o perfil informado.
- Usar APENAS os candidatos fornecidos.
- Manter coerência com preço, uso e prioridades.
- Evitar linguagem técnica excessiva.

Diretriz de negócio:
{$customPrompt}

Perfil do cliente (JSON):
{$profileJson}

Candidatos (JSON):
{$candidatesJson}

Regras obrigatórias:
- Não inventar modelos ou dados fora do JSON.
- Retornar no máximo 5 resultados.
- score deve ser inteiro de 0 a 100.
- justification deve ter entre 80 e 180 caracteres.

Retorne SOMENTE JSON válido no formato:
{
  "summary": "Resumo curto (1 frase) do racional da recomendação",
  "ranked": [
    { "id": "123", "score": 94, "justification": "..." }
  ]
}
PROMPT;

                $generated = callGeminiGenerate($prompt, $apiKey, $model);
                $rawRanked = isset($generated['ranked']) && is_array($generated['ranked']) ? $generated['ranked'] : [];

                $allowedIds = array_map(function ($candidate) {
                    return (string) ($candidate['id'] ?? '');
                }, $candidates);
                $seen = [];
                $ranked = [];

                foreach ($rawRanked as $item) {
                    $id = (string) ($item['id'] ?? '');
                    if ($id === '' || !in_array($id, $allowedIds, true)) continue;
                    if (isset($seen[$id])) continue;

                    $score = (int) round((float) ($item['score'] ?? 0));
                    if ($score < 0) $score = 0;
                    if ($score > 100) $score = 100;

                    $justification = trim((string) ($item['justification'] ?? 'Boa aderência ao perfil informado.'));
                    if ($justification === '') $justification = 'Boa aderência ao perfil informado.';
                    if (strlen($justification) > 240) $justification = substr($justification, 0, 240);

                    $ranked[] = [
                        'id' => $id,
                        'score' => $score,
                        'justification' => $justification,
                    ];
                    $seen[$id] = true;

                    if (count($ranked) >= 5) break;
                }

                if (count($ranked) === 0) {
                    jsonResponse(['error' => 'A IA não retornou ranking utilizável.'], 500);
                }

                $summary = trim((string) ($generated['summary'] ?? 'Ranking gerado com base no perfil e na faixa de preço informada.'));
                if (strlen($summary) > 280) $summary = substr($summary, 0, 280);

                jsonResponse([
                    'success' => true,
                    'summary' => $summary,
                    'ranked' => $ranked,
                ]);
                break;

            case 'generate_article_ai':
                $topic = trim((string) ($input['topic'] ?? ''));
                if ($topic === '') jsonResponse(['error' => 'Tema é obrigatório'], 400);

                $contentType = strtolower(trim((string) ($input['contentType'] ?? 'artigo')));
                if (!in_array($contentType, ['artigo', 'post', 'legenda'])) $contentType = 'artigo';

                $apiKey = trim((string) getStoreConfigValue($pdo, 'geminiApiKey', ''));
                if ($apiKey === '') {
                    $apiKey = defined('GEMINI_API_KEY') ? trim((string) GEMINI_API_KEY) : '';
                }
                if ($apiKey === '') {
                    jsonResponse(['error' => 'Gemini API Key não configurada. Salve em Configurações > Gemini API Key.'], 400);
                }

                $model = trim((string) getStoreConfigValue($pdo, 'geminiModel', 'gemini-2.5-flash'));
                if ($model === '') $model = 'gemini-2.5-flash';

                $typeLabel = $contentType === 'post' ? 'post informativo' : ($contentType === 'legenda' ? 'legenda curta' : 'artigo completo');

                $prompt = <<<PROMPT
Você é redator especialista em conteúdo para loja de smartphones e eletrônicos no Brasil.

Contexto da loja:
- Nome: GM Celular
- Objetivo: gerar conteúdo útil para vender mais e orientar clientes.
- Público: pessoas procurando celular novo/usado, acessórios, comparação de modelos, dicas de compra.

Tema solicitado: {$topic}
Tipo de conteúdo: {$typeLabel}

Regras:
- Escreva em português do Brasil.
- Linguagem clara, comercial e confiável.
- Conteúdo otimizado para SEO.
- Não inventar dados técnicos específicos sem necessidade.
- Fechar com CTA amigável para falar com a loja no WhatsApp.

Retorne SOMENTE JSON válido, sem markdown, no formato:
{
  "title": "Título atrativo",
  "excerpt": "Resumo curto",
  "tags": ["tag1", "tag2", "tag3"],
  "content_html": "<h2>...</h2><p>...</p><h3>...</h3><ul><li>...</li></ul><p>...</p>"
}
PROMPT;

                $generated = callGeminiGenerate($prompt, $apiKey, $model);

                $title = trim((string) ($generated['title'] ?? ''));
                $excerpt = trim((string) ($generated['excerpt'] ?? ''));
                $content = trim((string) ($generated['content_html'] ?? ''));
                $tagsRaw = $generated['tags'] ?? '';
                if (is_array($tagsRaw)) {
                    $tagsRaw = implode(', ', array_map(function ($tag) {
                        return trim((string) $tag);
                    }, $tagsRaw));
                }
                $tags = trim((string) $tagsRaw);

                if ($title === '' || $content === '') {
                    jsonResponse(['error' => 'A IA não retornou conteúdo suficiente.'], 500);
                }

                jsonResponse([
                    'success' => true,
                    'title' => $title,
                    'excerpt' => $excerpt,
                    'content' => $content,
                    'tags' => $tags,
                ]);
                break;

            case 'enhance_product_description_ai':
                $name = trim((string) ($input['name'] ?? ''));
                $currentDescription = trim((string) ($input['description'] ?? ''));
                $brand = trim((string) ($input['brand'] ?? ''));
                $modelName = trim((string) ($input['model'] ?? ''));
                $condition = trim((string) ($input['condition'] ?? ''));
                $category = trim((string) ($input['category'] ?? ''));
                $mode = trim((string) ($input['mode'] ?? 'format')); // 'format' | 'generate' | 'bullets'

                if ($name === '' && $currentDescription === '') {
                    jsonResponse(['error' => 'Informe ao menos o nome do produto ou a descrição atual.'], 400);
                }

                $apiKey = trim((string) getStoreConfigValue($pdo, 'geminiApiKey', ''));
                if ($apiKey === '') {
                    $apiKey = defined('GEMINI_API_KEY') ? trim((string) GEMINI_API_KEY) : '';
                }
                if ($apiKey === '') {
                    jsonResponse(['error' => 'Gemini API Key não configurada.'], 400);
                }

                $model = trim((string) getStoreConfigValue($pdo, 'geminiModel', 'gemini-2.5-flash'));
                if ($model === '') $model = 'gemini-2.5-flash';

                $instruction = match($mode) {
                    'generate' => 'Crie uma descrição completa, atraente e persuasiva para o produto na loja online, destacando suas principais qualidades e especificações técnicas.',
                    'bullets' => 'Organize as especificações e características em tópicos curtos e objetivos (com marcador •), pulando linha para cada especificação.',
                    default => 'Aprimore e corrija a formatação da descrição atual. Quebre em linhas bem definidas com marcadores (•), elimine textos embolados/amontoados, ajuste pontuação e padronize letras maiúsculas. Mantenha fielmente todas as informações técnicas e observações (como CONDIÇÃO SWAP, detalhes de peças substituídas, garantia ou observações de bateria).'
                };

                $prompt = <<<PROMPT
Você é um especialista em redação e formatação de catálogos para a loja de celulares e tecnologia "GM Celular".
Sua tarefa é formatar e aprimorar a descrição do produto para exibição na página de vendas, garantindo que as quebras de linha fiquem perfeitamente estruturadas.

Dados do Produto:
- Nome: {$name}
- Marca: {$brand}
- Modelo: {$modelName}
- Condição: {$condition}
- Categoria: {$category}
- Descrição Informada Atualmente:
{$currentDescription}

Instrução:
{$instruction}

Regras Essenciais de Formatação:
1. QUEBRA DE LINHA OBRIGATÓRIA: cada especificação técnica ou tópico DEVE estar em sua própria linha usando quebra de linha (\\n) e iniciar com marcador "• " (ou "- ").
2. Não junte vários tópicos em um único parágrafo corrido.
3. Se houver informações de "CONDIÇÃO SWAP" ou observações sobre componentes/peças/bateria, separe em uma seção própria pulando uma linha (\\n\\n) com o título "CONDIÇÃO SWAP:" ou "OBSERVAÇÕES:".
4. Evite usar asteriscos de negrito do markdown (ex: **não use**), pois o texto será exibido diretamente no site com quebra de linha simples.
5. Português do Brasil claro, profissional e comercial.
6. Nunca invente dados técnicos contraditórios aos informados.

Retorne SOMENTE um JSON válido com o campo "description":
{
  "description": "Texto formatado com quebras de linha explícitas (\\n) e tópicos"
}
PROMPT;

                $generated = callGeminiGenerate($prompt, $apiKey, $model);
                $formattedDesc = trim((string) ($generated['description'] ?? ''));

                if ($formattedDesc === '') {
                    jsonResponse(['error' => 'A IA não retornou a descrição formatada.'], 500);
                }

                jsonResponse([
                    'success' => true,
                    'description' => $formattedDesc
                ]);
                break;

            default:
                jsonResponse(['error' => 'Invalid action'], 400);
        }
    } catch (Exception $e) {
        jsonResponse(['error' => $e->getMessage()], 500);
    }
}
