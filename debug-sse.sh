#!/bin/bash
# Debug MCP Server in SSE mode with MCP Inspector
# Usage: bash debug-sse.sh

set -e

# Load .env if exists
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# Defaults
export MCP_TRANSPORT=${MCP_TRANSPORT:-sse}
export PORT=${PORT:-3001}

echo "Starting MCP Server in SSE mode on port $PORT..."

# Start SSE server in background
npm run start &
SERVER_PID=$!

# Wait for server to be ready
echo "Waiting for server to be ready..."
for i in $(seq 1 30); do
  if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/sse" 2>/dev/null | grep -q "200"; then
    echo "Server is ready at http://localhost:$PORT/sse"
    break
  fi
  if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "Server process exited unexpectedly"
    exit 1
  fi
  sleep 1
done

# Start Inspector
echo "Starting MCP Inspector..."
echo "In the Inspector UI, set Transport Type to SSE and URL to http://localhost:$PORT/sse"
echo ""
npx @modelcontextprotocol/inspector

# Cleanup on exit
kill $SERVER_PID 2>/dev/null
echo "Server stopped."
