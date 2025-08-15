# Secrets Management

This document outlines the procedures for managing sensitive credentials and API keys in the Sequence Theory project.

## Overview

All secrets must be rotated regularly and never committed to version control. This document provides step-by-step procedures for rotating each type of secret used in the system.

## Secret Types

### 1. Supabase API Keys

**Location**: Environment variables `VITE_SUPABASE_ANON_KEY` and `SERVICE_ROLE_KEY`

**Rotation Procedure**:
1. Log into Supabase dashboard
2. Navigate to Settings > API
3. Generate new anon key and service role key
4. Update environment variables in all environments
5. Test application functionality
6. Revoke old keys after 24-hour grace period

**Emergency Rotation**: If compromised, revoke immediately and update all environments within 1 hour.

### 2. Sequence WaaS API Keys

**Location**: Environment variables `VITE_SEQUENCE_PROJECT_ACCESS_KEY` and `VITE_SEQUENCE_WAAS_CONFIG_KEY`

**Rotation Procedure**:
1. Log into Sequence Builder dashboard
2. Navigate to project settings
3. Generate new access keys
4. Update environment variables
5. Test wallet connection functionality
6. Deactivate old keys

**Emergency Rotation**: Contact Sequence support for immediate key revocation.

### 3. Vault Club API Keys

**Location**: Environment variable `VITE_VAULT_CLUB_API_KEY`

**Rotation Procedure**:
1. Access vault club management interface
2. Generate new API key
3. Update environment variable
4. Test vault operations
5. Revoke old key

### 4. JWT Signing Secrets

**Location**: Environment variable `JWT_SECRET`

**Rotation Procedure**:
1. Generate new cryptographically secure secret (minimum 256 bits)
2. Update environment variable
3. Implement gradual rollover to maintain session validity
4. Monitor for authentication errors
5. Complete rollover after 7 days

**Emergency Rotation**: Immediate rotation will invalidate all user sessions.

### 5. Database Service Role Keys

**Location**: Environment variable `SERVICE_ROLE_KEY`

**Rotation Procedure**:
1. Generate new service role key in Supabase
2. Update all server-side functions
3. Test database operations
4. Revoke old key

## Rotation Scripts

### Automated Rotation Script

```bash
#!/bin/bash
# scripts/rotate-secrets.sh

set -e

echo "Starting secrets rotation..."

# Backup current environment
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Function to update environment variable
update_env_var() {
    local key=$1
    local value=$2
    
    if grep -q "^${key}=" .env; then
        sed -i "s/^${key}=.*/${key}=${value}/" .env
    else
        echo "${key}=${value}" >> .env
    fi
}

# Rotate JWT secret
echo "Rotating JWT secret..."
NEW_JWT_SECRET=$(openssl rand -hex 32)
update_env_var "JWT_SECRET" "$NEW_JWT_SECRET"

echo "Secrets rotation completed. Please update external service keys manually."
echo "Backup saved as .env.backup.$(date +%Y%m%d_%H%M%S)"
```

### Validation Script

```bash
#!/bin/bash
# scripts/validate-secrets.sh

set -e

echo "Validating secrets configuration..."

# Check required environment variables
REQUIRED_VARS=(
    "VITE_SUPABASE_URL"
    "VITE_SUPABASE_ANON_KEY"
    "JWT_SECRET"
    "SERVICE_ROLE_KEY"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "ERROR: $var is not set"
        exit 1
    fi
done

# Test Supabase connection
echo "Testing Supabase connection..."
curl -s -H "apikey: $VITE_SUPABASE_ANON_KEY" \
     -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
     "$VITE_SUPABASE_URL/rest/v1/" > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Supabase connection successful"
else
    echo "❌ Supabase connection failed"
    exit 1
fi

echo "All secrets validated successfully"
```

## Security Policies

### Never Log Tokens

- All logging must use the centralized logger that automatically redacts sensitive data
- Console.log statements containing tokens are prohibited
- Error messages must not expose API keys or secrets

### Token Patterns to Redact

The following patterns are automatically redacted in logs:
- JWT tokens: `eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+`
- API keys starting with: `st_`, `sk_`, `pk_`
- Bearer tokens: `Bearer [A-Za-z0-9_-]+`
- Any field containing: `api_key`, `token`, `secret`, `password`

### Emergency Procedures

**If secrets are compromised**:

1. **Immediate Response** (within 15 minutes):
   - Revoke compromised secrets in external services
   - Deploy emergency configuration with new secrets
   - Monitor for unauthorized access

2. **Short-term Response** (within 1 hour):
   - Rotate all related secrets
   - Review access logs for suspicious activity
   - Notify team members

3. **Long-term Response** (within 24 hours):
   - Conduct security audit
   - Update incident response procedures
   - Document lessons learned

## Monitoring

- Set up alerts for failed authentication attempts
- Monitor API usage patterns for anomalies
- Regular security audits of secret usage
- Automated scanning for secrets in code repositories

## Compliance

- Secrets must be rotated every 90 days minimum
- All secret access must be logged and auditable
- Secrets must never be transmitted over unencrypted channels
- Development and production secrets must be completely separate

---

*This document should be reviewed and updated quarterly or after any security incident.*
