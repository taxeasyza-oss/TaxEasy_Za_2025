#!/bin/bash

echo "🔍 SERVER & PORT STATUS VERIFICATION"
echo "===================================="

# Check if server is running
echo "1. Checking if Node.js server is running..."
if pgrep -f "node.*server.js" > /dev/null; then
    echo "✅ Node.js server process detected"
    SERVER_PID=$(pgrep -f "node.*server.js")
    echo "   PID: $SERVER_PID"
else
    echo "❌ No Node.js server process detected"
fi

# Check port usage
echo ""
echo "2. Checking port usage..."
for port in 3001 3002 3003; do
    if lsof -ti:$port > /dev/null 2>&1; then
        echo "⚠️  Port $port is in use by:"
        lsof -ti:$port | xargs -I {} ps -p {} -o pid,command 2>/dev/null | tail -n +2
    else
        echo "✅ Port $port is free"
    fi
done

# Check if server responds
echo ""
echo "3. Testing server responsiveness..."
if pgrep -f "node.*server.js" > /dev/null; then
    echo "Testing server endpoints..."
    
    # Test health endpoint
    if curl -s -f http://localhost:3001/api/health > /dev/null 2>&1; then
        echo "✅ Health endpoint responding"
        curl -s http://localhost:3001/api/health | jq -r '.status' 2>/dev/null && echo "   Status: Healthy"
    else
        echo "❌ Health endpoint not responding"
    fi
    
    # Test main page
    if curl -s -f http://localhost:3001 > /dev/null 2>&1; then
        echo "✅ Main page responding"
        if curl -s http://localhost:3001 | grep -q "TaxEasy"; then
            echo "   ✅ Serving TaxEasy content"
        else
            echo "   ⚠️  Serving content but not TaxEasy branded"
        fi
    else
        echo "❌ Main page not responding"
    fi
else
    echo "❌ Cannot test endpoints - server not running"
fi

# Check server logs if available
echo ""
echo "4. Recent server activity..."
if [ -f "npm-debug.log" ]; then
    echo "📋 Recent npm logs:"
    tail -5 npm-debug.log 2>/dev/null || echo "No recent npm logs"
fi

echo ""
echo "🔍 SERVER STATUS CHECK COMPLETE"