# Findings

## Descobertas do código
- O frontend ativo é React/Vite (`src/*`), não o `index.js` grande na raiz.
- Já existe integração Gemini no backend para geração de artigos (`api/index.php`, action `generate_article_ai`).
- Chave/modelo Gemini já são configuráveis no admin (`geminiApiKey`, `geminiModel`).
- Atualmente não existe página/rota de “melhor celular” no app React.
- Catálogo de produtos possui dados úteis: `name`, `description`, `brand`, `price`, `condition`, `status`, `featured`.

## Implicações
- Reuso direto da infraestrutura Gemini existente reduz esforço e risco.
- É viável criar um endpoint de recomendação IA sem quebrar o restante do backend.
- Será necessário criar um fluxo UI novo no frontend.
