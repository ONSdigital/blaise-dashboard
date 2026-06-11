# Blaise Dashboard

Blaise Dashboard provides a web UI for operational visibility of questionnaires and service health in a Blaise environment.

The app is a React frontend served by an Express backend and deployed to Google App Engine.

## What it shows

- Completed case information for installed questionnaires
- Questionnaire install status across Blaise nodes (active on all nodes or not)
- Blaise connection health status
- Service health check information from Google Cloud Monitoring

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) 24+
- [Yarn](https://yarnpkg.com/) 4+
- [Google Cloud SDK (`gcloud` CLI)](https://cloud.google.com/sdk/)

### Clone and install packages

```shell
git clone https://github.com/ONSdigital/blaise-dashboard.git
cd blaise-dashboard
yarn install
```

### Authenticate with Google Cloud (keyless)

Use service account impersonation for local development in the same way as DQS.

```shell
gcloud auth login
gcloud config set project ons-blaise-v2-dev
gcloud auth application-default login --impersonate-service-account=ons-blaise-v2-dev@appspot.gserviceaccount.com
```

### Start an IAP tunnel to Blaise REST API

Run this in a separate terminal and keep it running:

```shell
gcloud compute start-iap-tunnel restapi-1 80 --local-host-port=localhost:8080 --zone europe-west2-a
```

Expected output includes `Listening on port [8080]`.

### Configure environment variables

Create a `.env` file in the repository root (or `src/.env`) and set the following values:

```ini
BLAISE_API_URL=localhost:8080
SERVER_PARK=gusty
PROJECT_ID=ons-blaise-v2-dev-sandbox123
```

Variable reference:

| Variable | Description |
| --- | --- |
| `BLAISE_API_URL` | Blaise REST API host used by the dashboard server |
| `SERVER_PARK` | Blaise server park name |
| `PROJECT_ID` | GCP project for Monitoring checks |

### Run the app

```shell
yarn dev
```

UI is available at http://localhost:3000/.

## Common Scripts

- `yarn dev`: Run frontend + backend in watch mode
- `yarn build`: Build client and server
- `yarn build:client`: Build Vite frontend
- `yarn build:server`: Build TypeScript backend
- `yarn server`: Build backend and run server
- `yarn lint`: Run ESLint
- `yarn lint-fix`: Run ESLint autofix
- `yarn test`: Run Vitest suite with coverage
- `yarn test-watch`: Run Vitest in watch mode

## Deployment

This service is deployed to Google App Engine as `dashboard-ui`.
