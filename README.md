# blaise-dashboard

Web-based dashboard to view the status of various aspects of the data within a Blaise environment.

This project is a React.js application which when built is rendered by a Node.js express server.

The application is being deployed to Google App Engine.

### Components

#### Completed case information

Shows count, percentage, and progress bar of the cases completed for all installed questionnaire instruments. It's currently filtered to OPN only until questionnaire logic is updated for all surveys.

A collapsible element shows the definition of completed cases, as this could be misconstrued depending on the context.

The component has a configurable refresh, currently set to 10 seconds.

### Local Setup

Prerequisites:
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [Cloud SDK](https://cloud.google.com/sdk/)

Clone the repository:

```shell script
git clone https://github.com/ONSdigital/blaise-dashboard
```
Create an .env file in the root of the project and add the following variables:

| Variable | Description | Example |
| --- | --- | --- |
| BLAISE_API_URL | The RESTful API URL the application will use to get questionnaire data. | localhost:90 |
| SERVER_PARK | The name of the Blaise server park. | gusty |

Example .env file:

```shell
BLAISE_API_URL="localhost:90"
BLAISE_SERVER_PARK="gusty"
````

Install the project dependencies:

```shell script
yarn install
```

Authenticate with GCP:
```shell
gcloud auth login
```

Set your GCP project:
```shell
gcloud config set project ons-blaise-v2-dev-sandbox123
```

Open a tunnel to our Blaise RESTful API in your GCP project:
```shell
gcloud compute start-iap-tunnel restapi-1 80 --local-host-port=localhost:90 --zone europe-west2-a
```

Run Node.js server and React.js client via the following package.json script:

```shell script
yarn dev
```

The UI should now be accessible via:

http://localhost:3000/

Tests can be run via the following package.json script:

```shell script
yarn test
```

Test snapshots can be updated via:

```shell script
yarn test -u
```