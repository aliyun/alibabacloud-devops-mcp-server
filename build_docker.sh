#!/bin/bash

# 读取 package.json 中的 version
VERSION=$(node -p "require('./package.json').version")

echo "Building Docker image with version: v${VERSION}"

docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t build-steps-public-registry.cn-beijing.cr.aliyuncs.com/build-steps/alibabacloud-devops-mcp-server:v${VERSION} \
  -t build-steps-public-registry.cn-beijing.cr.aliyuncs.com/build-steps/alibabacloud-devops-mcp-server:latest \
  --push .