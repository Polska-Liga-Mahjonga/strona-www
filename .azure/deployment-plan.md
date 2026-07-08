# Azure Deployment Plan

## Status
Implemented (Ready for Validation and Deployment)

## 1. Project Mode
- Mode: MODIFY existing static website
- Existing app path: docs/
- Goal: Convert to editable CMS-style content with admin panel and Azure-hosted backend

## 2. Requirements Summary
- Host frontend on Azure Static Web Apps
- Add backend APIs with Azure Functions
- Enable editing of tournaments, news, team, and other content via admin panel
- Keep current public UX, but source key content from backend data
- Secure admin operations

## 3. Architecture Decisions
- Frontend: Azure Static Web App (static HTML/CSS/JS in docs/)
- Backend: Azure Functions (Node.js/TypeScript, v4 programming model)
- Data: Azure Cosmos DB (NoSQL, single content container)
- AuthN/AuthZ:
  - SWA built-in authentication
  - Custom role `admin` required for admin routes and API writes
- Content model:
  - Generic headless entries for `news`, `event`, `team`, `page-section`, `site-setting`

## 4. Planned Artifacts
- API service under api/
  - CRUD endpoints for admin
  - Public read endpoints for website pages
  - Seed endpoint for initial content bootstrap
- Admin UI page under docs/admin.html with JS client for CRUD
- Frontend dynamic data loader for homepage/events/news/team
- SWA routing/security config in docs/staticwebapp.config.json
- Azure deployment scaffolding:
  - azure.yaml
  - infra/main.bicep

## 5. Security Plan
- Admin APIs require `admin` role from SWA client principal
- Public APIs are read-only and return only published content
- Input validation and safe defaults on write operations
- Secrets are read from environment variables only

## 6. Verification Plan
- Ensure no HTML/CSS/JS errors in modified files
- Validate internal links still resolve
- Confirm API route structure and config files exist
- Document local run and Azure deployment steps

## 7. Implementation Scope in This Change
- Deliver code scaffolding and integration for CMS workflow
- Do not execute cloud deployment in this step
- Provide clear post-change runbook for provisioning + publish

## 8. Implementation Result
- Admin panel delivered at `/admin.html` with role-gated CRUD for CMS content.
- Public pages wired to CMS API for `event`, `news`, and `team` content with static fallback content.
- Azure deployment scaffolding delivered:
  - `azure.yaml`
  - `infra/main.bicep`
  - `docs/staticwebapp.config.json`
- Backend dependencies installed and TypeScript build validated successfully.
