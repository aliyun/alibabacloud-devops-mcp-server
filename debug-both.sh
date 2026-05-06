#!/bin/bash
# Debug MCP Server in dual mode (SSE + Streamable HTTP) with MCP Inspector
# Usage: bash debug-both.sh
#
# Waits until GET /sse returns 200 and OPTIONS on the Streamable path returns 204.
#
# Note: start Node directly (not npm run) so $! tracks the server process (see debug-streamable-http.sh).

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
export MCP_TRANSPORT=${MCP_TRANSPORT:-both}
export PORT=${PORT:-3001}
MCP_PATH="${MCP_STREAMABLE_PATH:-/mcp}"

if [ ! -f dist/index.js ]; then
  echo "dist/index.js not found. Run: npm run build"
  exit 1
fi

echo "Starting MCP Server in dual mode (SSE + Streamable HTTP) on port $PORT (Streamable path: $MCP_PATH)..."

# Start dual-transport server in background (Node PID, not npm)
node dist/index.js --sse --streamable-http &
SERVER_PID=$!

# Wait for server to be ready (SSE endpoint + Streamable CORS)
echo "Waiting for server to be ready..."
for i in $(seq 1 30); do
  sse_code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$PORT/sse" 2>/dev/null || echo "000")
  mcp_code=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "http://127.0.0.1:$PORT${MCP_PATH}" 2>/dev/null || echo "000")
  if [ "$sse_code" = "200" ] && [ "$mcp_code" = "204" ]; then
    echo "Server is ready:"
    echo "  SSE:        http://127.0.0.1:$PORT/sse"
    echo "  Streamable: http://127.0.0.1:$PORT${MCP_PATH}"
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
