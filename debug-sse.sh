#!/bin/bash
# Debug MCP Server in SSE mode with MCP Inspector
# Usage: bash debug-sse.sh
#
# Note: start Node directly (not npm run) so $! is the real server PID.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Load .env if exists
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# Defaults
export MCP_TRANSPORT=${MCP_TRANSPORT:-sse}
export PORT=${PORT:-3001}

if [ ! -f dist/index.js ]; then
  echo "dist/index.js not found. Run: npm run build"
  exit 1
fi

echo "Starting MCP Server in SSE mode on port $PORT..."

# Start SSE server in background (Node PID, not npm)
node dist/index.js --sse &
SERVER_PID=$!

# Wait for server to be ready
echo "Waiting for server to be ready..."
for i in $(seq 1 30); do
  if curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$PORT/sse" 2>/dev/null | grep -q "200"; then
    echo "Server is ready at http://127.0.0.1:$PORT/sse"
    break
  fi
  if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "Server process exited unexpectedly"
    exit 1
  fi
  sleep 1
done

# Cleanup on exit
kill $SERVER_PID 2>/dev/null
echo "Server stopped."
