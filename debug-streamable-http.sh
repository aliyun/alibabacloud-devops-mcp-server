#!/bin/bash
# Debug MCP Server in Streamable HTTP mode with MCP Inspector
# Usage: bash debug-streamable-http.sh
#
# Waits until OPTIONS on the Streamable endpoint returns 204 (CORS preflight path).
#
# Note: start the Node process directly (not via npm run) so $! is the real server PID;
# npm may exit immediately in background while Node keeps running, which breaks kill -0 checks.

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
export MCP_TRANSPORT=${MCP_TRANSPORT:-streamable-http}
export PORT=${PORT:-3001}
MCP_PATH="${MCP_STREAMABLE_PATH:-/mcp}"

if [ ! -f dist/index.js ]; then
  echo "dist/index.js not found. Run: npm run build"
  exit 1
fi

echo "Starting MCP Server in Streamable HTTP mode on port $PORT (path: $MCP_PATH)..."

# Start Streamable HTTP server in background (Node PID, not npm)
node dist/index.js --streamable-http &
SERVER_PID=$!

# Wait for server to be ready
echo "Waiting for server to be ready..."
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "http://127.0.0.1:$PORT${MCP_PATH}" 2>/dev/null || echo "000")
  if [ "$code" = "204" ]; then
    echo "Server is ready at http://127.0.0.1:$PORT${MCP_PATH}"
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
