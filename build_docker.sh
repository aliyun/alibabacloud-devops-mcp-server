docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t your-registry/yunxiao-mcp-server:latest \
  --push .