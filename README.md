# Google Drive Realtime API Playground

## Overview

**Google Drive Realtime API Playground**, is a web app for web developer that lets you try out the features of the [Google Drive Realtime API](https://developers.google.com/drive/realtime).

The Playground will take you through the steps required to have the Realtime API working on your application and can be used as a reference implementation of a Google Drive Realtime API application.

## Installation and Configuration

The project can be run out of any static web server though we provide a configuration file to host it on App Engine.

If you wish to host it in your own App Engine instance make sure you set the name of your App Engine application in `/app.yaml`. To create an App Engine instance follow the instructions on [appengine.google.com](https://appengine.google.com).

### Create a Google APIs project and Activate the Drive API

First, you need to activate the Drive API for your app. You can do this in your app's API project in the Google APIs Console.

- Create an API project in the [Google APIs Console](https://developers.google.com/console).
- Select the Services tab in your API project, and enable the Drive API.
- Select the API Access tab in your API project, and click Create an OAuth 2.0 client ID.
- In the Branding Information section, provide a name for your application (e.g. "Drive Quickstart Sample"), and click Next. Providing a product logo is optional.
- In the Client ID Settings section, do the following:
  - Select Web application for the Application type
  - Click the more options link next to the heading, Your site or hostname.
  - List your hostname in the Authorized Redirect URIs and JavaScript Origins fields.
  - Click Create Client ID.
- In the API Access page, locate the section Client ID for Web applications and note the Client ID value.
- List your hostname in JavaScript origins in the Client ID settings.


### Setup your App inforamtion in the code

Also in `/js/rtpg.js` change the `appId` and the `clientId` in the `rtpg.realTimeOptions` object.

### Deploy, run that's it!