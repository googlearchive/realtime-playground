# Google Drive Realtime API Playground

[![Google Drive Realtime API Playground Screenshot](https://github.com/googledrive/realtime-playground/raw/master/screenshot.png)](https://realtimeplayground.appspot.com/)

## Overview

**Google Drive Realtime API Playground**, is a web app that helps you to try out the features of the [Google Drive Realtime API](https://developers.google.com/drive/realtime).

The Playground will take you through the steps required to have the Realtime API working on your application and can be used as a reference implementation of a Google Drive Realtime API application.

You can try out the Google Drive Realtime API Playground on its [live instance](https://realtimeplayground.appspot.com).

## Installation and Configuration

The project can run on any static web server, but we also provide required configuration and boilerplate files to host it on App Engine.

If you wish to host it in your own App Engine instance make sure you set the name of your App Engine application in `/app.yaml`. To create an App Engine instance follow the instructions on [appengine.google.com](https://appengine.google.com).

### Create a Google APIs project and Activate the Drive API

First, you need to activate the Drive API for your app. You can do it by configuring your API project in the Google APIs Console.

- Create an API project in the [Google APIs Console](https://code.google.com/apis/console/b/0/?noredirect).
- Select the "Services" tab and enable the Drive API.
- Select the "API Access" tab in your API project, and click "Create an OAuth 2.0 client ID".
- In the Branding Information section, provide a name for your application (e.g. "CollabCube 3D"), and click Next. Providing a product logo is optional.
- In the Client ID Settings section, do the following:
  - Select Web application for the Application type
  - Click the more options link next to the heading, Your site or hostname.
  - List your hostname in the Authorized Redirect URIs and JavaScript Origins fields.
  - Click Create Client ID.
- In the **API Access** page, locate the section **Client ID for Web applications** and note the **Client ID** value.
- List your hostname in JavaScript origins in the Client ID settings.
- Go to the **Drive SDK** page and copy the **App ID**.

### Setup your App information in the code

You should now have your **Client ID** and your **App ID**. In `/js/rtpg.js` change the `APP_ID` and the `CLIENT_ID` constants at the top of the file.

### Deploy, run that's it!

## Contributing

Before creating a pull request, please fill out either the individual or
corporate Contributor License Agreement.

* If you are an individual writing original source code and you're sure you
own the intellectual property, then you'll need to sign an
[individual CLA](http://code.google.com/legal/individual-cla-v1.0.html).
* If you work for a company that wants to allow you to contribute your work
to this client library, then you'll need to sign a
[corporate CLA](http://code.google.com/legal/corporate-cla-v1.0.html).

Follow either of the two links above to access the appropriate CLA and
instructions for how to sign and return it. Once we receive it, we'll add you
to the official list of contributors and be able to accept your patches.
