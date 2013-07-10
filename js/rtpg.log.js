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
rtpg.log = rtpg.log || {};

/**
 * DOM selector for the output element for Log Demo.
 */
rtpg.log.LOG_CONTAINER_SELECTOR = '#demoLog';

rtpg.log.createLogEntryElement = function(msg) {
  var img = $('<img>').attr('src', msg.picUrl).attr('alt', msg.userName).attr('title', msg.userName);
  return $('<tr>'
    ).append($('<td>').attr('class', 'color').text('\xa0').css('background-color', msg.color)
    ).append($('<td>').attr('class', 'icons').append(img)
    ).append($('<td>').attr('class', 'from').text(msg.eventDetails).prepend($('<b>').text(msg.eventType))
    ).append($('<td>').attr('class', 'message').text('Event at')
    ).append($('<td>').attr('class', 'date').text(rtpg.log.formatDate(new Date(msg.time)))
    ).attr('class',msg.isLocal ? 'localEvent' : '');
};


rtpg.log.logEvent = function(evt, eventType) {
  var collaborator = rtpg.getCollaborator(evt.sessionId);
  
  var eventDetails;
  // Collab String events
  if (evt.type == gapi.drive.realtime.EventType.TEXT_INSERTED || evt.type == gapi.drive.realtime.EventType.TEXT_DELETED) {
    eventDetails = '"' + evt.text.replace(/ /g, '\xa0') + '" at index ' + evt.index;
  // Collab Map/Custom Objects property changed events
  } else if (evt.type == gapi.drive.realtime.EventType.VALUE_CHANGED) {
    eventDetails = 'Property "' + evt.property + '" changed from "' + evt.oldValue + '" to "' + evt.newValue + '"';
  // Collab List Added and Deleted events
  } else if (evt.type == gapi.drive.realtime.EventType.VALUES_ADDED || evt.type == gapi.drive.realtime.EventType.VALUES_REMOVED) {
    eventDetails = '"' + evt.values.join(', ') + '" at index ' + evt.index;
  // Collab List Added events
  } else if (evt.type == gapi.drive.realtime.EventType.VALUES_SET) {
    eventDetails = 'From "' + evt.oldValues.join(', ') + '" to "' + evt.newValues.join(', ') + '" at index ' + evt.index;
  // Reference Shifted events
  } else if (evt.type == gapi.drive.realtime.EventType.REFERENCE_SHIFTED) {
    eventDetails = 'From ' + evt.oldIndex + ' to ' + evt.newIndex;
  // Collaborators list events
  } else if (evt.type == gapi.drive.realtime.EventType.COLLABORATOR_JOINED || evt.type == gapi.drive.realtime.EventType.COLLABORATOR_LEFT) {
    eventDetails = evt.collaborator.displayName;
    collaborator = evt.collaborator;
  }
  
  var logMessage = {
    eventType: eventType + ': ',
    picUrl: collaborator.photoUrl == null ? "images/anon.jpeg" : collaborator.photoUrl,
    userName: collaborator.displayName,
    color: collaborator.color,
    time: new Date().getTime(),
    eventDetails: eventDetails,
    isLocal: evt.isLocal
  };
  
  rtpg.log.onLogAdded(logMessage);
};

rtpg.log.formatDate = function(date) {
  var hh = date.getHours();
  var mm = date.getMinutes();
  var ss = date.getSeconds();
  // These lines ensure you have two-digits
  if (hh < 10) {hh = "0"+hh;}
  if (mm < 10) {mm = "0"+mm;}
  if (ss < 10) {ss = "0"+ss;}
  // This formats your string to HH:MM:SS
  return hh+":"+mm+":"+ss;
}

rtpg.log.onLogAdded = function(logMessage) {
  $(rtpg.log.LOG_CONTAINER_SELECTOR).prepend(rtpg.log.createLogEntryElement(logMessage));
  rtpg.ui.hideShowLocalEvents();
};

