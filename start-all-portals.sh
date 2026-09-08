#!/bin/bash
# This script starts all portals and the API backend concurrently
# For Windows: Run from Git Bash or use individual terminal windows

echo "Starting Multi-Portal Development Environment..."
echo ""
echo "Ports:"
echo "  - Backend API:          http://localhost:5000"
echo "  - Customer Portal:      http://localhost:5173"
echo "  - Provider Portal:      http://localhost:5174"
echo "  - Provider Analytics:   http://localhost:5175"
echo "  - Admin Portal:         http://localhost:5176"
echo "  - Support Portal:       http://localhost:5177 (Phase 2)"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Function to handle graceful shutdown
cleanup() {
  echo ""
  echo "Shutting down all services..."
  kill 0
}

trap cleanup EXIT INT TERM

# Start backend API
cd services/api
pnpm dev &
API_PID=$!

# Wait for API to start
sleep 3

# Start portals (in background)
cd ../../packages/@restaurant/customer-web
pnpm dev &
CUSTOMER_PID=$!

cd ../provider-web
pnpm dev &
PROVIDER_PID=$!

cd ../provider-analytics
pnpm dev &
ANALYTICS_PID=$!

cd ../admin-web
pnpm dev &
ADMIN_PID=$!

cd ../support-web
pnpm dev &
SUPPORT_PID=$!

echo ""
echo "✅ All services started!"
echo ""

# Wait for all processes
wait
