# sih26117-workbench

React frontend and FastAPI backend workbench.

## Structure

- `frontend/` - React application
- `backend/` - FastAPI application
- `infra/` - Docker, firewall, and monitoring configuration
- `models/` - Offline model weights (ignored by Git)
- `storage/` - Runtime data (ignored by Git)
  - `uploads/` - User-uploaded documents
  - `generated/` - AI-generated files
  - `sandbox/` - Temporary Python tool workspace
- `scripts/` - Setup and offline packaging scripts
- `docs/` - Architecture, API contract, and presentation assets

## Commands

```bash
make up
make down
make offline-bundle
```

Copy `.env.example` to `.env` before starting services.
"# Swayambhu.ai" 
"# Swayambhu.ai" 
