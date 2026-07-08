# Deployment and Local Execution Guide

This guide explains how to run the project locally and deploy it to Azure.

## 1. Project structure

- Frontend static site: `docs/`
- Backend API (Azure Functions): `api/`
- Azure IaC: `infra/main.bicep`
- AZD project config: `azure.yaml`

## 2. Prerequisites

Install and verify:

- Node.js 20+
- npm
- Azure CLI (`az`)
- Azure Developer CLI (`azd`)
- Azure Functions Core Tools (`func`)
- Optional for local storage emulator: Azurite
- Optional for full local SWA simulation: Static Web Apps CLI (`swa`)

Version checks:

```powershell
node -v
npm -v
az version
azd version
func --version
```

## 3. Local execution

### 3.1 Configure local backend settings

1. Copy example settings:

```powershell
Copy-Item api/local.settings.example.json api/local.settings.json
```

2. Choose one of these Cosmos modes:

- Emulator fallback mode (default in example file):
   - Keep `COSMOS_ENDPOINT` and `COSMOS_KEY` empty.
   - Keep `COSMOS_EMULATOR_FALLBACK=true`.
   - Start Cosmos DB Emulator locally.

- Azure Cosmos mode:
   - Set `COSMOS_ENDPOINT` and `COSMOS_KEY` with real Azure values.
   - Optionally set `COSMOS_EMULATOR_FALLBACK=false`.

3. Keep content store values (or adjust if needed):

- `COSMOS_DATABASE` (default: `plm-cms`)
- `COSMOS_CONTAINER` (default: `content`)

4. For `AzureWebJobsStorage`:

- Keep `UseDevelopmentStorage=true` and run Azurite, or
- Replace with a real Azure Storage connection string.

### 3.2 Run API locally

```powershell
Set-Location api
npm install
npm run build
npm start
```

Health check URL:

- `http://localhost:7071/api/health`

### 3.3 Run full site + API locally (recommended)

From repository root:

```powershell
swa start docs --api-location api
```

This provides local routing for both frontend and `/api/*` endpoints.

Default local URL:

- `http://localhost:4280`

### 3.4 Optional static frontend-only preview

```powershell
npx serve docs -l 4280
```

Note: frontend-only mode does not proxy `/api/*` automatically.

## 4. Azure deployment (AZD)

Run from repository root.

### 4.1 Authenticate

```powershell
az login
azd auth login
```

### 4.2 Create/select environment

```powershell
azd env new dev
```

If environment already exists:

```powershell
azd env select dev
```

### 4.3 Provision and deploy

```powershell
azd up
```

What this does:

- Provisions resources from `infra/main.bicep`
- Deploys frontend (`docs/`) to Azure Static Web Apps
- Deploys backend (`api/`) to Azure Functions

### 4.4 Deploy code changes without reprovisioning

```powershell
azd deploy
```

### 4.5 Optional teardown

```powershell
azd down
```

## 5. Post-deployment verification

1. Open deployed site URL (from AZD output).
2. Verify API health endpoint:
   - `https://<your-site>/api/health`
3. Open admin page:
   - `https://<your-site>/admin.html`
4. Sign in and verify admin role access.
5. Use the admin panel to seed initial data and confirm content appears on:
   - Home page
   - Events page
   - News page
   - Team page

## 6. Admin access notes

Static Web App config enforces:

- `/admin.html` requires role `admin`
- `/api/admin/*` requires role `admin`
- `/api/*` public read endpoints remain anonymous

Configure user role assignments in Azure Static Web Apps authentication/authorization settings.
