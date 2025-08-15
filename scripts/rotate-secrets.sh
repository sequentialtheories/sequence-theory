#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔄 Starting secrets rotation for Sequence Theory..."
echo "Project root: $PROJECT_ROOT"

BACKUP_FILE=".env.backup.$(date +%Y%m%d_%H%M%S)"
if [ -f "$PROJECT_ROOT/.env" ]; then
    cp "$PROJECT_ROOT/.env" "$PROJECT_ROOT/$BACKUP_FILE"
    echo "✅ Environment backup created: $BACKUP_FILE"
fi

update_env_var() {
    local key=$1
    local value=$2
    local env_file="$PROJECT_ROOT/.env"
    
    if [ -f "$env_file" ]; then
        if grep -q "^${key}=" "$env_file"; then
            sed -i "s/^${key}=.*/${key}=${value}/" "$env_file"
        else
            echo "${key}=${value}" >> "$env_file"
        fi
    else
        echo "${key}=${value}" > "$env_file"
    fi
    echo "✅ Updated $key"
}

generate_secret() {
    openssl rand -hex 32
}

echo "🔑 Rotating JWT secret..."
NEW_JWT_SECRET=$(generate_secret)
update_env_var "JWT_SECRET" "$NEW_JWT_SECRET"

echo "🔑 Rotating signing secret..."
NEW_SIGNING_SECRET=$(generate_secret)
update_env_var "SIGNING_SECRET" "$NEW_SIGNING_SECRET"

echo ""
echo "🎉 Automated secrets rotation completed!"
echo ""
echo "⚠️  MANUAL STEPS REQUIRED:"
echo "1. Rotate Supabase API keys in dashboard"
echo "2. Update VITE_SUPABASE_ANON_KEY and SERVICE_ROLE_KEY"
echo "3. Rotate Sequence WaaS keys in Sequence Builder"
echo "4. Update VITE_SEQUENCE_PROJECT_ACCESS_KEY and VITE_SEQUENCE_WAAS_CONFIG_KEY"
echo "5. Rotate Vault Club API key"
echo "6. Update VITE_VAULT_CLUB_API_KEY"
echo ""
echo "📋 Run validation script: ./scripts/validate-secrets.sh"
echo "📁 Backup saved as: $BACKUP_FILE"
