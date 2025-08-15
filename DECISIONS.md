# Technical Decisions

This document outlines non-negotiable technical decisions for the Sequence Theory project. These decisions establish the foundation for all development work and must be understood by every team member.

## Auth: Token-first SSO

All authentication flows prioritize API token-based single sign-on. User sessions are managed through secure JWT tokens with automatic refresh capabilities. Direct password authentication is discouraged in favor of token-based flows that integrate with external identity providers.

## Backend: Proxy-only strategy

All backend services operate through a proxy architecture. Direct database access from frontend applications is prohibited. All data operations must flow through designated API endpoints that provide proper validation, authorization, and audit logging.

## Deployment: Testnet-first

All deployments target testnet environments before production. Smart contract interactions, wallet connections, and blockchain operations must be thoroughly tested on testnets (Polygon Amoy, Chain ID 80002) before any mainnet deployment consideration.

## Math: Explicit rounding rules

All mathematical operations involving financial calculations must use explicit rounding rules. No implicit floating-point arithmetic is permitted for monetary values. All rounding must be documented and consistent across the application.

## Logic: Phase-2 triggers

Application logic follows a two-phase trigger system. Phase 1 handles validation and preparation, Phase 2 executes the actual operation. This ensures atomic operations and proper error handling for all critical business logic.

## Access: Invite/token policy

System access is controlled through an invite-based token policy. New users must be explicitly invited and receive access tokens. No open registration is permitted. All access tokens have defined expiration periods and rotation schedules.

## Ops: Emergency posture

Emergency procedures prioritize system safety over availability. In case of security incidents or critical failures, the system defaults to a locked-down state. All emergency procedures are documented and regularly tested.

---

*This document should be readable in under 2 minutes by any new developer joining the project.*
