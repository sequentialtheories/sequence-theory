#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔍 Validating secrets configuration..."

if [ -f "$PROJECT_ROOT/.env" ]; then
    source "$PROJECT_ROOT/.env"
    echo "✅ Environment file loaded"
else
    echo "⚠️  No .env file found, checking system environment"
fi

REQUIRED_VARS=(
    "VITE_SUPABASE_URL"
    "VITE_SUPABASE_ANON_KEY"
    "JWT_SECRET"
)

OPTIONAL_VARS=(
    "SERVICE_ROLE_KEY"
    "VITE_SEQUENCE_PROJECT_ACCESS_KEY"
    "VITE_SEQUENCE_WAAS_CONFIG_KEY"
    "VITE_VAULT_CLUB_API_KEY"
    "SIGNING_SECRET"
)

echo ""
echo "📋 Checking required variables..."
for var in "${REQUIRED_VARS[@]}"; do
    if [ -n "${!var}" ]; then
        echo "✅ $var is set"
    else
        echo "❌ $var is missing"
        exit 1
    fi
done

echo ""
echo "📋 Checking optional variables..."
for var in "${OPTIONAL_VARS[@]}"; do
    if [ -n "${!var}" ]; then
        echo "✅ $var is set"
    else
        echo "⚠️  $var is not set (optional)"
    fi
done

if [ -n "$VITE_SUPABASE_URL" ] && [ -n "$VITE_SUPABASE_ANON_KEY" ]; then
    echo ""
    echo "🔗 Testing Supabase connection..."
    
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "apikey: $VITE_SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
        "$VITE_SUPABASE_URL/rest/v1/" || echo "000")
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "✅ Supabase connection successful"
    else
        echo "❌ Supabase connection failed (HTTP $HTTP_STATUS)"
        echo "   Check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
    fi
fi

echo ""
echo "🔒 Security checks..."

if [ -n "$JWT_SECRET" ]; then
    if [ ${#JWT_SECRET} -ge 32 ]; then
        echo "✅ JWT_SECRET has adequate length"
    else
        echo "⚠️  JWT_SECRET should be at least 32 characters"
    fi
fi

PLACEHOLDER_PATTERNS=("your_" "example_" "placeholder_" "changeme" "TODO")
for pattern in "${PLACEHOLDER_PATTERNS[@]}"; do
    if grep -q "$pattern" "$PROJECT_ROOT/.env" 2>/dev/null; then
        echo "⚠️  Found placeholder values in .env file - please update with real values"
        break
    fi
done

echo ""
echo "🎉 Secrets validation completed!"
echo ""
echo "💡 Next steps:"
echo "1. If any tests failed, update the corresponding secrets"
echo "2. Test your application to ensure everything works"
echo "3. Deploy updated secrets to production environment"
