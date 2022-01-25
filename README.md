# blaise-dashboard

Web-based dashboard blah blah blah...

This project is a React.js application which when built is rendered by a Node.js express server.

The application is being deployed to Google App Engine.

### Local Setup

Install [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) if you haven't already done so.

Clone the repository:

```shell script
git clone https://github.com/ONSdigital/ ...
```
Create an .env file in the root of the project and add the following variables:

| Variable | Description | Example |
| --- | --- | --- |
| BLAISE_API_URL | | |
| SERVER_PARK | | |

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

Run Node.js via the package.json script:

```shell script
yarn start-server
```

Run React.js via the package.json script:

```shell script
yarn start-react
```

The UI should now be accessible via:

http://localhost:3000/

Tests can be run via the package.json script:

```shell script
yarn test
```

Test snapshots can be updated via:

```shell script
yarn test -u
```