#!/bin/bash
# =====================================================
# GM Celular — Deploy Script
# Uso: bash deploy.sh  OU  npm run deploy
# =====================================================
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
SSH_USER="gmso3652"
SSH_HOST="gmcelular.com.br"
SSH_PORT="1157"
SSH_PASS="0G*6!pFOPf5ff8"
TARGET_DIRS=("public_html" "repositories/Gmcelular" ".gmcelular/GmCelular.com.br")

# ── 1. BUILD ──────────────────────────────────────
echo ""
echo "📦 Gerando build..."
cd "$ROOT"
rm -rf dist
npm run build

# ── 2. IDENTIFICA ARQUIVOS NOVOS ─────────────────
JS_PATH=$(find "$ROOT/dist/assets" -name "app-*.js" 2>/dev/null | head -1)
CSS_PATH=$(find "$ROOT/dist/assets" -name "index-*.css" 2>/dev/null | head -1)
JS_FILE=$(basename "$JS_PATH")
CSS_FILE=$(basename "$CSS_PATH")

echo "   JS  : assets/$JS_FILE"
echo "   CSS : assets/$CSS_FILE"

ASSET_FILES=("$JS_PATH" "$CSS_PATH")
for img in "$ROOT"/dist/assets/*.png; do
  [ -e "$img" ] && ASSET_FILES+=("$img")
done

# ── 3. UPLOAD PARA TODAS AS PASTAS DO SERVIDOR ────
for TARGET_DIR in "${TARGET_DIRS[@]}"; do
  echo ""
  echo "🚀 Atualizando $TARGET_DIR..."
  
  sshpass -p "$SSH_PASS" ssh -p "$SSH_PORT" \
    -o StrictHostKeyChecking=no \
    -o PreferredAuthentications=password \
    "$SSH_USER@$SSH_HOST" "mkdir -p $TARGET_DIR/assets && cd $TARGET_DIR/assets && rm -f app-*.js index-*.css || true"

  sshpass -p "$SSH_PASS" scp -P "$SSH_PORT" \
    -o StrictHostKeyChecking=no \
    -o PreferredAuthentications=password \
    "$ROOT/dist/index.html" "$ROOT/.htaccess" \
    "$SSH_USER@$SSH_HOST:$TARGET_DIR/"

  sshpass -p "$SSH_PASS" scp -P "$SSH_PORT" \
    -o StrictHostKeyChecking=no \
    -o PreferredAuthentications=password \
    "${ASSET_FILES[@]}" \
    "$SSH_USER@$SSH_HOST:$TARGET_DIR/assets/"

  sshpass -p "$SSH_PASS" ssh -p "$SSH_PORT" \
    -o StrictHostKeyChecking=no \
    -o PreferredAuthentications=password \
    "$SSH_USER@$SSH_HOST" "chmod 755 $TARGET_DIR && chmod -R 755 $TARGET_DIR/assets"
done

# ── 4. CONFIRMAÇÃO ────────────────────────────────
echo ""
echo "✅ Deploy concluído em todas as pastas com sucesso!"

