#!/bin/bash

set -euo pipefail

echo "${GOOGLE_CREDENTIALS}" >/tmp/google_creds.json
gcloud auth activate-service-account --project="${GCP_PROJECT}" --key-file=/tmp/google_creds.json

cd dashboard

gcloud --quiet app deploy