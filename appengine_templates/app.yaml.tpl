service: dashboard-ui
runtime: nodejs16

vpc_access_connector:
  name: projects/_PROJECT_ID/locations/europe-west2/connectors/vpcconnect

resources:
  memory_gb: 1.0
env_variables:
  BLAISE_API_URL: _BLAISE_API_URL
  PROJECT_ID: _PROJECT_ID
  SERVER_PARK: _SERVER_PARK

basic_scaling:
  idle_timeout: 10m
  max_instances: 10

handlers:
- url: /.*
  script: auto
  secure: always
  redirect_http_response_code: 301