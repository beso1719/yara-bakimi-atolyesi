#!/bin/sh
# src/ parçalarından iki çıktı üretir: index.html (Artifact) ve docs/index.html (GitHub Pages, tam belge)
cd "$(dirname "$0")"
JS="src/core.js src/art.js src/rounds.js src/data.js src/final.js"
{ cat src/head.html; cat src/body.html; echo '<script>'; cat $JS; echo '</script>'; } > index.html
mkdir -p docs
{ echo '<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
  cat src/head.html; echo '</head><body>'; cat src/body.html; echo '<script>'; cat $JS; echo '</script></body></html>'; } > docs/index.html
