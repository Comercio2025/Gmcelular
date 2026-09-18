#!/bin/sh
# Post-build: limpa arquivos antigos da raiz e copia os novos do dist/

ROOT="$(dirname "$0")"

echo "🧹 Removendo arquivos antigos da raiz..."
# Remove qualquer JS/CSS do build anterior (com ou sem hash)
rm -f "$ROOT"/app-*.js "$ROOT"/chunk-*.js "$ROOT"/index-*.css "$ROOT"/index.js "$ROOT"/index.css

echo "📋 Copiando arquivos novos do dist/ para a raiz..."
cp "$ROOT/dist/index.html" "$ROOT/index.html"
cp "$ROOT"/dist/app-*.js "$ROOT/"
cp "$ROOT"/dist/index-*.css "$ROOT/"

echo "✅ Pronto! Arquivos atualizados na pasta raiz:"
ls -lh "$ROOT"/app-*.js "$ROOT"/index-*.css "$ROOT/index.html" 2>/dev/null
