#!/bin/bash

set -e

echo "[Kalika] Parando container antigo..."
docker rm -f kalika-ws 2>/dev/null || true

echo "[Kalika] Removendo imagem antiga..."
docker rmi kalika-ws 2>/dev/null || true

echo "[Kalika] Buildando nova imagem..."
docker build -t kalika-ws .

echo "[Kalika] Subindo container novo..."
docker run -d \
  --name kalika-ws \
  --network host \
  -e PORT=3001 \
  -e LLAMA_HOST=127.0.0.1 \
  -e LLAMA_PORT=11435 \
  kalika-ws

echo "[Kalika] Container kalika-ws está rodando!"
