-- Products
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  name VARCHAR(255),
  category VARCHAR(50),
  price DECIMAL(12,2) DEFAULT 0,
  details TEXT,
  description TEXT,
  imageUrl TEXT,
  statusId VARCHAR(50),
  conditionId VARCHAR(50),
  brandId VARCHAR(50),
  reference VARCHAR(255),
  supplierId VARCHAR(50),
  costUSD DECIMAL(12,2),
  costBRL DECIMAL(12,2),
  markup DECIMAL(6,2),
  profitBRL DECIMAL(12,2)
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  name VARCHAR(255),
  parentId VARCHAR(50)
);

-- Banners
CREATE TABLE IF NOT EXISTS banners (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  imageUrl TEXT,
  altText VARCHAR(255),
  linkUrl TEXT,
  title VARCHAR(255),
  subtitle TEXT,
  textColor VARCHAR(20),
  textPosition VARCHAR(50)
);

-- Brands
CREATE TABLE IF NOT EXISTS brands (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  name VARCHAR(255)
);

-- Conditions
CREATE TABLE IF NOT EXISTS conditions (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  name VARCHAR(255)
);

-- Statuses
CREATE TABLE IF NOT EXISTS statuses (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  name VARCHAR(255)
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  name VARCHAR(255)
);

-- Pages
CREATE TABLE IF NOT EXISTS pages (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  title VARCHAR(255),
  slug VARCHAR(255),
  content TEXT,
  isVisible TINYINT(1) DEFAULT 1
);

-- Store configuration (single row: id='config')
CREATE TABLE IF NOT EXISTS store_config (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  storeName VARCHAR(255),
  slogan VARCHAR(255),
  logoUrl TEXT,
  address VARCHAR(255),
  whatsappNumber VARCHAR(50),
  instagramHandle VARCHAR(50),
  primaryColor VARCHAR(20),
  secondaryColor VARCHAR(20),
  font VARCHAR(50),
  announcementBar_text TEXT,
  announcementBar_enabled TINYINT(1) DEFAULT 0,
  headerMenu TEXT
);

-- Optional seed data (remove if you do not want defaults)
INSERT INTO categories (id, name) VALUES ('cat1','Smartphones') ON DUPLICATE KEY UPDATE name=VALUES(name);
INSERT INTO categories (id, name) VALUES ('cat2','Acessorios') ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO brands (id, name) VALUES ('brand1','Apple') ON DUPLICATE KEY UPDATE name=VALUES(name);
INSERT INTO brands (id, name) VALUES ('brand2','Samsung') ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO conditions (id, name) VALUES ('cond1','Novo') ON DUPLICATE KEY UPDATE name=VALUES(name);
INSERT INTO conditions (id, name) VALUES ('cond2','Usado') ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO statuses (id, name) VALUES ('status1','Ativo') ON DUPLICATE KEY UPDATE name=VALUES(name);
INSERT INTO statuses (id, name) VALUES ('status2','Por Encomenda') ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO suppliers (id, name) VALUES ('supp1','Fornecedor Padrao') ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO pages (id, title, slug, content, isVisible) VALUES
('page1','Sobre Nos','sobre-nos','<h1>Sobre a GM Celular</h1><p>Conteudo inicial.</p>',1)
ON DUPLICATE KEY UPDATE title=VALUES(title), slug=VALUES(slug), content=VALUES(content), isVisible=VALUES(isVisible);

INSERT INTO pages (id, title, slug, content, isVisible) VALUES
('page2','Garantia','garantia','<h1>Garantia</h1><p>Atualize este conteudo.</p>',1)
ON DUPLICATE KEY UPDATE title=VALUES(title), slug=VALUES(slug), content=VALUES(content), isVisible=VALUES(isVisible);

INSERT INTO store_config (id, storeName, slogan, logoUrl, address, whatsappNumber, instagramHandle, primaryColor, secondaryColor, font, announcementBar_text, announcementBar_enabled, headerMenu) VALUES
('config','GM Celular','Assistencia tecnica e variedades','',
'Av. Barao do Rio Branco, 1234, Capanema - PA','5591987654321','gmcapanema',
'#007BFF','#0A192F','Inter','Novos iPhones 15 em estoque! Garanta o seu!',1,
'[{\"id\":\"menu1\",\"label\":\"Inicio\",\"type\":\"home\",\"value\":\"/\"},{\"id\":\"menu2\",\"label\":\"Sobre Nos\",\"type\":\"page\",\"value\":\"page1\"},{\"id\":\"menu3\",\"label\":\"Garantia\",\"type\":\"page\",\"value\":\"page2\"}]')
ON DUPLICATE KEY UPDATE
  storeName=VALUES(storeName),
  slogan=VALUES(slogan),
  logoUrl=VALUES(logoUrl),
  address=VALUES(address),
  whatsappNumber=VALUES(whatsappNumber),
  instagramHandle=VALUES(instagramHandle),
  primaryColor=VALUES(primaryColor),
  secondaryColor=VALUES(secondaryColor),
  font=VALUES(font),
  announcementBar_text=VALUES(announcementBar_text),
  announcementBar_enabled=VALUES(announcementBar_enabled),
  headerMenu=VALUES(headerMenu);
