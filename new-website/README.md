# ImmunHelden Partner Login

In our [partner login area](https://dev.immunhelden.de/en/partner), organizations can create and manage their entries [in our map](https://immunhelden.de/maps/all/). There are three major pieces of functionality:

* **Authentication:** register, double opt-in, login, logout
* **Overview page:** a table lists all entries and provides features for searching, sorting, add and delete
* **Edit page:** separate page that allows to edit all properties of a specific entry

# Short intro for developers

Our frontend, backend and database are all [hosted in Google Firebase](https://console.firebase.google.com/u/0/project/immunhelden/):
* The frontend is built with [Gatsby JS](https://www.gatsbyjs.com/), a [static site generator](https://www.gatsbyjs.com/docs/glossary/static-site-generator/) for [ReactJS](https://reactjs.org/). It makes heavy use of [Material UI](https://material-ui.com/) components.
* The backend runs the Firebase adaption of [Node JS](https://nodejs.org/) und runs on [serverless functions](https://en.wikipedia.org/wiki/Serverless_computing). This makes it quite easy to run locally.
* The database is a NoSQL document-based [Google Cloud Firestore](https://cloud.google.com/firestore).

## Requirements

You'll need a few tools to start developing:

* We check out the sources and submit patches with `git`: https://git-scm.com/downloads
* We install dependencies and run the backend locally with `npm`: https://nodejs.org/
* We use recent versions of both, [Firefox](https://www.mozilla.org/de-DE/firefox/new/) and [Chrome](https://www.google.com/chrome/) browsers to view and work with the frontend.
* We use [Visual Studio Code](https://code.visualstudio.com/) for editing the source code.

## Getting started

Partner Login is part of the [ImmunHelden.de repository](https://github.com/ImmunHelden/ImmunHelden.de). In order to build it and run it locally, you need to checkout the sources first:
```
> git clone https://github.com/ImmunHelden/ImmunHelden.de
```

Now switch to the `new-website` subdirectory, checkout the `develop` branch and install dependencies with `npm`:
```
> cd ImmunHelden.de/new-website
> git checkout develop
> npm install
```

Next, install `yarn` and set the `GATSBY_FIREBASE_API_KEY` environment variable. Please find our actual API key in the [Firebase Project Console](https://console.firebase.google.com/u/0/project/immunhelden/settings/general/):
```
> npm install -g yarn
> export GATSBY_FIREBASE_API_KEY=AIzaS...
```

Run the development server:
```
> yarn develop
```

Now open your browser and navigate to http://localhost:8000/de/partner in order to access the frontend. With Visual Studio Code you can easily view and edit the sources:

```
> code .
```

You can use the regular Firefox or Chrome developer tools for debugging and analysis in the client. For debugging in VSCode, install the [Debugger for Chrome extension](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) and use a `launch.json` configuration like this:
```
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug in Chrome",
      "url": "http://localhost:8000/partner/",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

## Deployment

todo
