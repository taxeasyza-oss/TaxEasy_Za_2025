#!/bin/bash
echo "🔍 PERFORMANCE MONITORING"
echo "Testing live application performance..."

APP_URL="https://taxeasy-za-2025.onrender.com"

echo "Testing main application..."
curl -o /dev/null -s -w "Main page: %{time_total}s\n" $APP_URL

echo "Testing API endpoints..."
curl -o /dev/null -s -w "Health endpoint: %{time_total}s\n" $APP_URL/api/health

echo "Testing tax calculation..."
curl -o /dev/null -s -w "Tax API: %{time_total}s\n" \
  -X POST $APP_URL/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"grossIncome":500000,"ageGroup":"under65"}'

echo "✅ Performance test complete"