
Utils = function (options) {
  this.init(options);
}

Utils.prototype = {

  options: {
    clientId: null,
    mimeType: 'application/vnd.google-apps.drive-sdk',

  },

  scopes: ['https://www.googleapis.com/auth/drive.install',
          'https://www.googleapis.com/auth/drive.file'],

  init: function (options) {
    this.mergeOptions(options);
    this.authorizer = new Authorizer(this);
    this.createRealtimeFile = this.createRealtimeFile.bind(this);
  },

  authorize: function (onAuthComplete, usePopup) {
    this.authorizer.start(onAuthComplete, usePopup);
  },

  mergeOptions: function (options) {
    for(option in options){
      this.options[option] = options[option];
    }
  },

  // Check the url to see if we have a document id
  getDocumentIdFromUrl: function() {
    var params = {};
    var hashFragment = window.location.hash;
    if(hashFragment){
      return hashFragment.replace('#','');
    }
    
    return false;
  },

  getParam: function (param) {
    var regExp = new RegExp(param + '=(.*?)($|&)', 'g');
    var match = window.location.search.match(regExp);
    if(match && match.length){
      match = match[0];
      match = match.replace(param + '=','').replace('&','');
    } else {
      match = null;
    }
    return match;
  },

  createRealtimeFile: function(title, callback) {
    var that = this;
    window.gapi.client.load('drive', 'v2', function() {
      window.gapi.client.drive.files.insert({
        'resource': {
          mimeType: that.options.mimeType,
          title: title
        }
      }).execute(callback);
    });
  },

  load: function(documentId, onFileLoaded, initializeModel) {
    window.gapi.drive.realtime.load(documentId, onFileLoaded, initializeModel, this.onError);
  },

  onError: function(e) {
    if(e.type == window.gapi.drive.realtime.ErrorType.TOKEN_REFRESH_REQUIRED) {
      this.authorizer.authorize(function () {
        console.log('Error, auth refreshed');
      }, false);
    } else if(e.type == window.gapi.drive.realtime.ErrorType.CLIENT_ERROR) {
      alert("An Error happened: " + e.message);
      window.location.href= "/";
    } else if(e.type == window.gapi.drive.realtime.ErrorType.NOT_FOUND) {
      alert("The file was not found. It does not exist or you do not have read access to the file.");
      window.location.href= "/";
    } else if(e.type == window.gapi.drive.realtime.ErrorType.FORBIDDEN) {
      alert("You do not have access to this file. Try having the owner share it with you from Google Drive.");
      window.location.href= "/";
    }
  }
}


Authorizer = function (util) {
  this.util = util;
  this.handleAuthResult = this.handleAuthResult.bind(this);
  this.token = null;
  this.serverUrl = this.util.getParam('serverUrl');
}

Authorizer.prototype = {

  refreshInterval: 1800000, // 30 minutes

  start: function(onAuthComplete, usePopup) {
    var config = {};
    if(this.serverUrl){
      switch(this.serverUrl){
        case 'sandbox':
          this.serverUrl = 'https://drive.sandbox.google.com/otservice'
          break;
      }
      config['drive-realtime'] =  { 'server' : this.serverUrl };
    }
    var that = this;
    window.gapi.load('auth:client,drive-realtime,drive-share', {
      config: config,
      callback:  function() {
        that.authorize(onAuthComplete, usePopup);
      }
    });
    if(this.authTimer){
      this.authTimer.clear();
    }
    this.refreshAuth();
  },

  authorize: function (onAuthComplete, usePopup) {
    this.onAuthComplete = onAuthComplete;
    // Try with no popups first.
    window.gapi.auth.authorize({
      client_id: this.util.options.clientId,
      scope: this.util.scopes,
      user_id: this.util.options.userId,
      immediate: !usePopup
    }, this.handleAuthResult);
  },

  handleAuthResult: function (authResult) {
    if (authResult && !authResult.error) {
      this.token = authResult.access_token;
    }
    this.onAuthComplete(authResult);
  },

  refreshAuth: function () {
    var that = this;
    this.authTimer = setTimeout(function () {
      that.authorize(function(){
        console.log('Refreshed Auth Token');
      }, false);
      that.refreshAuth();
    }, this.refreshInterval);
  }
}
