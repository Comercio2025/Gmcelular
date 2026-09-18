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
REMOTE_DIR="repositories/Gmcelular"

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

# ── 3. GARANTE PASTAS NO SERVIDOR ─────────────────
sshpass -p "$SSH_PASS" ssh -p "$SSH_PORT" \
  -o StrictHostKeyChecking=no \
  -o PreferredAuthentications=password \
  "$SSH_USER@$SSH_HOST" "mkdir -p $REMOTE_DIR/assets"

# ── 4. LIMPA ARQUIVOS ANTIGOS NO SERVIDOR (SSH) ───
echo ""
echo "🧹 Removendo arquivos antigos no servidor via SSH..."
sshpass -p "$SSH_PASS" ssh -p "$SSH_PORT" \
  -o StrictHostKeyChecking=no \
  -o PreferredAuthentications=password \
  "$SSH_USER@$SSH_HOST" "
    echo '--- Limpando root ---'
    cd $REMOTE_DIR && rm -f app-*.js chunk-*.js index-*.css index.js index.css vite.svg || true
    echo '--- Limpando assets/ ---'
    cd $REMOTE_DIR/assets && rm -f app-*.js chunk-*.js index-*.css logo-*.png og-banner-*.png || true
    echo 'Pronto'
  "

# ── 5. UPLOAD index.html PARA RAIZ ───────────────
echo ""
echo "🚀 Enviando index.html para $REMOTE_DIR/..."
sshpass -p "$SSH_PASS" scp -P "$SSH_PORT" \
  -o StrictHostKeyChecking=no \
  -o PreferredAuthentications=password \
  "$ROOT/dist/index.html" \
  "$SSH_USER@$SSH_HOST:$REMOTE_DIR/"

# ── 6. UPLOAD JS + CSS + IMAGENS PARA assets/ ────
echo "🚀 Enviando assets/ para $REMOTE_DIR/assets/..."
ASSET_FILES=("$JS_PATH" "$CSS_PATH")
for img in "$ROOT"/dist/assets/*.png; do
  [ -e "$img" ] && ASSET_FILES+=("$img")
done

sshpass -p "$SSH_PASS" scp -P "$SSH_PORT" \
  -o StrictHostKeyChecking=no \
  -o PreferredAuthentications=password \
  "${ASSET_FILES[@]}" \
  "$SSH_USER@$SSH_HOST:$REMOTE_DIR/assets/"

# ── 7. CONFIRMAÇÃO ────────────────────────────────
echo ""
echo "✅ Deploy concluído!"
sshpass -p "$SSH_PASS" ssh -p "$SSH_PORT" \
  -o StrictHostKeyChecking=no \
  -o PreferredAuthentications=password \
  "$SSH_USER@$SSH_HOST" "
    echo '--- $REMOTE_DIR/ ---'
    ls -lh $REMOTE_DIR/index.html
    echo '--- $REMOTE_DIR/assets/ ---'
    ls -lh $REMOTE_DIR/assets/*.js $REMOTE_DIR/assets/*.css 2>/dev/null
  "
