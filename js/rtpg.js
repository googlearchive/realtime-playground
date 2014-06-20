/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Realtime playground.
 *
 * Shows off and demos various Realtime API features. This application is
 * intentionally low-tech, and devoid of clever abstraction, being designed
 * to be used as a sample.
 */

/**
 * Realtime playground namespace.
 */
var rtpg = rtpg || {};

/** Your Application ID from the Google APIs Console. */
rtpg.APP_ID = YOUR_APP_ID;

/** Your application's Client ID from the Google APIs Console. */
rtpg.CLIENT_ID = YOUR_CLIENT_ID;

rtpg.realtimeDoc = null;

rtpg.allDemos = [];

rtpg.mapDemos = function(callback) {
  return rtpg.allDemos.map(callback);
};


/**
 * Whether Realtime has loaded the doc and model.
 *
 * This is used as a guard to ensure that certain state has been set before
 * attempting to use it.
 */
rtpg.isInitialized = function() {
  return (rtpg.string.field != null);
}


rtpg.getField = function(name) {
  return rtpg.realtimeDoc.getModel().getRoot().get(name);
}

rtpg.LOG_SELECTOR = '#demoLog';
rtpg.SHARE_SELECTOR = '#demoShareButton';
rtpg.OPEN_SELECTOR = '#openExistingDoc';
rtpg.CREATE_SELECTOR = '#createNewDoc';
rtpg.AUTH_BUTTON_ID = 'demoAuthorizeButton';
rtpg.AUTH_HOLDER_SELECTOR = '#demoUnauthorizedOverlay';
rtpg.CREATE_DOC_HOLDER_SELECTOR = '#demoChooseDocument';
rtpg.SHARE_DOC_HOLDER_SELECTOR = '#demoShare';
rtpg.INITILIZED_MESSAGE_SELECTOR = '#realtimeInitialized';
rtpg.COLLAB_HOLDER_SELECTOR = '#collabSections';
rtpg.AUTHORIZED_MESSAGE_HOLDER_SELECTOR = '#authorizedMessage';

/**
 * Generates the initial model for newly created Realtime documents.
 * @param model
 */
rtpg.initializeModel = function(model) {
  var l = rtpg.allDemos.length;
  for (var i = 0; i < l; i++) {
    var demo = rtpg.allDemos[i];
    demo.initializeModel(model);
  }
};

// Called when the realtime file has been loaded.
rtpg.onFileLoaded = function(doc) {
  console.log('File loaded');
  console.log(doc);
  rtpg.realtimeDoc = doc;
  // Binding UI and listeners for demo data elements.
  for (var i = 0; i < rtpg.allDemos.length; i++) {
    var demo = rtpg.allDemos[i];
    demo.loadField();
    demo.updateUi();
    demo.connectUi();
    demo.connectRealtime(doc);
  }
  
  // Activating undo and redo buttons.
  var model = doc.getModel();
  $('#undoButton').click(function(){model.undo();});
  $('#redoButton').click(function(){model.redo();});

  // Add event handler for UndoRedoStateChanged events.
  var onUndoRedoStateChanged = function(e) {
    $('#undoButton').prop('disabled', !e.canUndo);
    $('#redoButton').prop('disabled', !e.canRedo);
  };
  model.addEventListener(gapi.drive.realtime.EventType.UNDO_REDO_STATE_CHANGED, onUndoRedoStateChanged);

  // We load the name of the file to populate the file name field.
  gapi.client.load('drive', 'v2', function() {
    var request = gapi.client.drive.files.get({
      'fileId' : rtclient.params['fileIds'].split(',')[0]
    });
    $('#documentName').attr('disabled', '');
    request.execute(function(resp) {
      $('#documentName').val(resp.title);
      $('#documentName').removeAttr('disabled');
      $('#documentName').change(function() {
        $('#documentName').attr('disabled', '');
        var body = {'title': $('#documentName').val()};
        var renameRequest = gapi.client.drive.files.patch({
          'fileId' : rtclient.params['fileIds'].split(',')[0],
          'resource' : body
        });
        renameRequest.execute(function(resp) {
          $('#documentName').val(resp.title);
          $('#documentName').removeAttr('disabled');
        });   
      });
    });
  });

  // Showing message that a doc has been loaded
  $('#documentNameContainer').show();
  // Enable Step 3 and 4
  $(rtpg.SHARE_DOC_HOLDER_SELECTOR).removeClass('disabled');
  $(rtpg.INITILIZED_MESSAGE_SELECTOR).show();
  $(rtpg.COLLAB_HOLDER_SELECTOR).removeClass('disabled');
  //Re-enabling buttons to create or load docs
  $('#createNewDoc').removeClass('disabled');
  $('#openExistingDoc').removeClass('disabled');
};

// Register all types on Realtime doc creation.
rtpg.registerTypes = function() {
  var l = rtpg.allDemos.length;
  for (var i = 0; i < l; i++) {
    var demo = rtpg.allDemos[i];
    var registerTypes = demo.registerTypes;
    if (registerTypes) {
      registerTypes();
    }
  }
  console.log(rtpg);
}

// Opens the Google Picker.
rtpg.popupOpen = function() {
  var token = gapi.auth.getToken().access_token;
  var view = new google.picker.View(google.picker.ViewId.DOCS);
  view.setMimeTypes("application/vnd.google-apps.drive-sdk." + rtpg.realTimeOptions.appId);
  var picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .setAppId(rtpg.realTimeOptions.appId)
      .setOAuthToken(token)
      .addView(view)
      .addView(new google.picker.DocsUploadView())
      .setCallback(rtpg.openCallback)
      .build();
  picker.setVisible(true);
}

// Called when a file has been selected using the Google Picker.
rtpg.openCallback = function(data) {
  if (data.action == google.picker.Action.PICKED) {
    var fileId = data.docs[0].id;
    rtpg.realtimeLoader.redirectTo([fileId], rtpg.realtimeLoader.authorizer.userId);
  }
}

// Popups the Sharing dialog.
rtpg.popupShare = function() {
  var shareClient = new gapi.drive.share.ShareClient(rtpg.realTimeOptions.appId);
  shareClient.setItemIds(rtclient.params['fileIds'].split(','));
  shareClient.showSettingsDialog();
}

// Connects UI elements to functions.
rtpg.connectUi = function() {
  $(rtpg.SHARE_SELECTOR).click(rtpg.popupShare);
  $(rtpg.OPEN_SELECTOR).click(rtpg.popupOpen);
}

// Initializes the Realtime Playground.
rtpg.start = function() {
  rtpg.realtimeLoader = new rtclient.RealtimeLoader(rtpg.realTimeOptions);
  rtpg.connectUi();
  rtpg.realtimeLoader.start();
};

rtpg.afterAuth = function() {
  $(rtpg.CREATE_DOC_HOLDER_SELECTOR).removeClass('disabled');
  $(rtpg.AUTHORIZED_MESSAGE_HOLDER_SELECTOR).show();
  
  $(rtpg.CREATE_SELECTOR).click(function() {
    $(rtpg.CREATE_SELECTOR).addClass('disabled');
    $(rtpg.OPEN_SELECTOR).addClass('disabled');
    rtpg.realtimeLoader.createNewFileAndRedirect();
  });
}

rtpg.afterLoad = function() {
  
}

// Options container for the realtime client utils.
rtpg.realTimeOptions = {
  appId: rtpg.APP_ID,
  clientId: rtpg.CLIENT_ID,
  authButtonElementId: rtpg.AUTH_BUTTON_ID,
  autoCreate: false,
  initializeModel: rtpg.initializeModel,
  onFileLoaded: rtpg.onFileLoaded,
  registerTypes: rtpg.registerTypes,
  afterAuth: rtpg.afterAuth,
  newFileMimeType: null, // Using default.
  defaultTitle: "New Realtime Playground File"
};

// Returns the collaborator for the given session ID.
rtpg.getCollaborator = function(sessionId) {
  var collaborators = rtpg.realtimeDoc.getCollaborators();
  for (var i = 0; i < collaborators.length; i = i+1) {
    if(collaborators[i].sessionId == sessionId) {
      return collaborators[i];
    }
  }
  return null;
};

// Returns the Collaborator object for the current user.
rtpg.getMe = function() {
  var collaborators = rtpg.realtimeDoc.getCollaborators();
  for (var i = 0; i < collaborators.length; i = i+1) {
    if(collaborators[i].isMe) {
      return collaborators[i];
    }
  }
  return null;
};
