/**
 * Copyright 2013 Google Inc. All Rights Reserved.
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

 "use strict";

/**
 * Namespace for Log Demo.
 */
rtpg.collaborators = rtpg.collaborators || {};

rtpg.allDemos.push(rtpg.collaborators);

/**
 * DOM selector for the output element for Log Demo.
 */
rtpg.collaborators.COLLABORATORS_SELECTOR = '#collaborators';

rtpg.collaborators.loadField = function() {
}

rtpg.collaborators.initializeModel = function(model) {
}

rtpg.collaborators.updateUi = function() {
  var collaboratorsList = rtpg.realtimeDoc.getCollaborators();
  $(rtpg.collaborators.COLLABORATORS_SELECTOR).empty();
  for (var i = 0; i < collaboratorsList.length; i = i + 1) {
    var collaborator = collaboratorsList[i];
    var imgSrc = collaborator.photoUrl == null ? 'images/anon.jpeg' : collaborator.photoUrl;
    var img = $('<img>').attr('src', imgSrc).attr('alt', collaborator.displayName).attr('title', collaborator.displayName + (collaborator.isMe ? " (Me)" : ""));
    img.css('background-color', collaborator.color);
    $(rtpg.collaborators.COLLABORATORS_SELECTOR).append(img);
  }
};

rtpg.collaborators.connectUi = function() {
};

rtpg.collaborators.connectRealtime = function(doc) {
  //Adding Listeners for Collaborator events.
  doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, rtpg.collaborators.onCollaboratorJoined);
  doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, rtpg.collaborators.onCollaboratorLeft);
  rtpg.collaborators.updateUi();
};

rtpg.collaborators.onCollaboratorJoined = function(event) {
  rtpg.log.logEvent(event, 'User opened the document');
  rtpg.collaborators.updateUi();
};

rtpg.collaborators.onCollaboratorLeft = function(event) {
  rtpg.log.logEvent(event, 'User closed the document');
  rtpg.collaborators.updateUi();
};
