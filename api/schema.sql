-- Tabela de Configurações
CREATE TABLE IF NOT EXISTS store_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(50) UNIQUE NOT NULL,
    config_value TEXT
);

-- Tabelas Auxiliares (Cadastros)
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS conditions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS product_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    color VARCHAR(20) DEFAULT 'blue'
);

CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    image_url TEXT NOT NULL,
    link TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos (Atualizada)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    cost_price DECIMAL(10, 2) DEFAULT 0.00,
    image_url TEXT,
    category_id INT,
    brand_id INT,
    model VARCHAR(255),
    condition_id INT,
    status_id INT,
    stock INT DEFAULT 1,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
    FOREIGN KEY (condition_id) REFERENCES conditions(id) ON DELETE SET NULL,
    FOREIGN KEY (status_id) REFERENCES product_statuses(id) ON DELETE SET NULL
);

-- Dados Iniciais (Opcional - apague se não quiser dados de teste)
INSERT IGNORE INTO categories (name, slug) VALUES ('Smartphones', 'smartphones'), ('Acessórios', 'acessorios');
INSERT IGNORE INTO brands (name, slug) VALUES ('Apple', 'apple'), ('Samsung', 'samsung');
INSERT IGNORE INTO conditions (name, slug) VALUES ('Novo', 'novo'), ('Usado', 'usado');
INSERT IGNORE INTO product_statuses (name, slug, color) VALUES ('Ativo', 'active', 'green'), ('Inativo', 'inactive', 'gray');

