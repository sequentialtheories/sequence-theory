# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/902c4709-595e-47f5-b881-6247d8b5fbf9

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/902c4709-595e-47f5-b881-6247d8b5fbf9) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/902c4709-595e-47f5-b881-6247d8b5fbf9) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
## Vault Club integration: env, functions, and migrations

Environment variables expected by Edge Functions:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- VAULT_CLUB_API_KEY
- Optional: VAULT_CLUB_EDGE_KEY

CORS and headers:
- Edge Functions allow: authorization, x-client-info, apikey, content-type, x-vault-club-api-key, idempotency-key

Idempotency and audit logging:
- Table: public.idempotency_keys
- Edge Functions vault-club-user-creation and vault-club-auth-sync accept Idempotency-Key and cache responses
- Audit entries are written to api_access_logs

Epoch-based simulation:
- contract_deposits has a generated epoch_id based on date_trunc('week', created_at)
- current_epoch() returns the current weekly epoch as bigint
- contract_epoch_stats view summarizes totals per contract_id, epoch_id
- process_epoch(contract_id uuid, epoch_id bigint) confirms pending deposits for that epoch

How to apply migrations:
1) Apply SQL files in supabase/migrations:
   - 20250811113000_idempotency.sql
   - 20250811113500_epochs.sql
   - 20250811114000_indices.sql
2) Deploy functions:
   - supabase functions deploy vault-club-user-creation
   - supabase functions deploy vault-club-auth-sync
   - supabase functions deploy external-api

Deployment via Git connection:
- Repository: sequentialtheories/sequence-theory
- Branch: devin/1754825321-edge-contracts or main
- Root: supabase/functions

Staging/runtime config for TVC
- window.__TVC_CONFIG.functionsBase = "https://qldjhlnsphlixmzzrdwi.functions.supabase.co"
- window.__TVC_CONFIG.vaultClubApiKey = "&lt;VAULT_CLUB_API_KEY&gt;"
