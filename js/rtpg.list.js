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

"use strict";

/**
 * Namespace for List Demo.
 */
rtpg.list = rtpg.list || {};

rtpg.allDemos.push(rtpg.list);

/**
 * Realtime model's field name for List Demo.
 */
rtpg.list.FIELD_NAME = 'demo_list';

/**
 * Realtime model's field name for the Cursor Demo.
 */
rtpg.list.CURSORS_NAME = 'demo_cursors';

/**
 * Realtime model's field for List Demo.
 */
rtpg.list.field = null;


/**
 * Starting value of field for List Demo.
 */
rtpg.list.START_VALUE = ['Cat', 'Dog', 'Sheep', 'Chicken'];


/**
 * DOM selector for the output element for List Demo.
 */
rtpg.list.ADD_SELECTOR = '#demoListAdd';
rtpg.list.ADD_CONTENT_SELECTOR = '#demoListAddContent';
rtpg.list.REMOVE_SELECTOR = '#demoListRemove';
rtpg.list.CLEAR_SELECTOR = '#demoListClear';
rtpg.list.SET_SELECTOR = '#demoListSet';
rtpg.list.SET_CONTENT_SELECTOR = '#demoListSetContent';

/**
 * DOM selector for the move button
 */
rtpg.list.MOVE_SELECTOR = '#demoListMove';

/**
 * DOM selector for the move text field
 */
rtpg.list.MOVE_CONTENT_SELECTOR = '#demoListMoveItem';

/**
 * DOM selector for the input element for List Demo.
 */
rtpg.list.INPUT_SELECTOR = '#demoListInput';

rtpg.list.loadField = function() {
  rtpg.list.field = rtpg.getField(rtpg.list.FIELD_NAME);
  rtpg.list.cursors = rtpg.getField(rtpg.list.CURSORS_NAME);
  if(rtpg.list.cursors){
    rtpg.list.garbageCollectCursorMap();  
  }
};

/**
 * Method that will remove collaborators cursors who are not on the document
 * any more, and check for cursors of collaborators who were already present.
 */
rtpg.list.garbageCollectCursorMap = function() {
  // Clean up the cursor map
  var keys = rtpg.list.cursors.keys();
  for(var i = 0, len = keys.length; i < len; i++){
    if(!rtpg.getCollaborator(keys[i])){
      // Delete non existing collaborators
      rtpg.list.cursors.delete(keys[i]);
    } else {
      // Create listeners for collaborators that already existed when the document opened
      rtpg.list.cursors.get(keys[i])
        .addEventListener(gapi.drive.realtime.EventType.REFERENCE_SHIFTED, 
          rtpg.list.onRealtimeReferenceShifted);
    }
  }
};

rtpg.list.initializeModel = function(model) {
  var field = model.createList(),
      cursors = model.createMap();

  field.pushAll(rtpg.list.START_VALUE);
  model.getRoot().set(rtpg.list.FIELD_NAME, field);
  model.getRoot().set(rtpg.list.CURSORS_NAME, cursors);
};

rtpg.list.updateUi = function() {
  var array = rtpg.list.field.asArray();

  $(rtpg.list.INPUT_SELECTOR).empty();
  for(var i = 0, len = array.length; i < len; i++){
    var listItem = $('<li></li>').text(array[i]);
    listItem.on('click', rtpg.list.onListItemClick);
    $(rtpg.list.INPUT_SELECTOR).append(listItem);
  }
  rtpg.list.updateListItems();
};

/**
 * Method to hand list item clicks
 */
rtpg.list.onListItemClick = function(evt) {
  var index = $(evt.target).index(),
      me = rtpg.getMe();

  rtpg.realtimeDoc.getModel().beginCompoundOperation('', false);
  // Register Reference
  if (!rtpg.list.field.registeredReference) {
    // The creation of the registered reference is marked as non undoable
    rtpg.list.field.registeredReference = rtpg.list.field.registerReference(
      index, true);
    rtpg.list.field.registeredReference
      .addEventListener(gapi.drive.realtime.EventType.REFERENCE_SHIFTED,
        rtpg.list.onRealtimeReferenceShifted);
    if (rtpg.list.cursors) {
      rtpg.list.cursors.set(
        rtpg.getMe().sessionId, rtpg.list.field.registeredReference);
    }
  }

  // Any new index changes are inside a non undoable compound operation, and will not
  // be able to be undone.
  rtpg.list.field.registeredReference.index = index;
  rtpg.realtimeDoc.getModel().endCompoundOperation();

  // Set text for move button and set field
  $(rtpg.list.SET_CONTENT_SELECTOR).val($(evt.target).text());
  $(rtpg.list.MOVE_SELECTOR).text('Move ' + $(evt.target).text() + ' to index');
};

/**
 * Method to keep list items in sync with data model
 */
rtpg.list.updateListItems = function() {
  var me = rtpg.getMe(),
      listItems = $(rtpg.list.INPUT_SELECTOR + ' li'),
      keys;
  
  listItems.removeClass('muted').removeAttr('style');

  if(rtpg.list.field.registeredReference) {
    listItems.removeClass('active');
    $(listItems[rtpg.list.field.registeredReference.index])
      .addClass('active').css('background-color', me.color);
  }

  if(rtpg.list.cursors){
    keys = rtpg.list.cursors.keys();
    for(var i = 0, len = keys.length; i < len; i++){
      if(keys[i] != me.sessionId){
        var index = rtpg.list.cursors.get(keys[i]).index;
        var collaborator = rtpg.getCollaborator(keys[i]);
        $(listItems[index]).addClass('muted');
        $(listItems[index]).css('background-color', collaborator.color);
      }
    }
  }
};

rtpg.list.onClearList = function() {
  rtpg.list.field.clear();
};

rtpg.list.onSetItem = function() {
  var newValue = $(rtpg.list.SET_CONTENT_SELECTOR).val();
  var indexToSet = $(rtpg.list.INPUT_SELECTOR + ' .active').index();
  if (newValue != '' && indexToSet != -1) {
    rtpg.list.field.set(indexToSet, newValue);
  }
};

rtpg.list.onRemoveItem = function() {
  var indexToRemove = $(rtpg.list.INPUT_SELECTOR + ' .active').index();
  rtpg.list.field.remove(indexToRemove);
};

rtpg.list.onAddItem = function() {
  var newValue = $(rtpg.list.ADD_CONTENT_SELECTOR).val();
  if (newValue != '') {
    rtpg.list.field.push(newValue);
  }
};

/**
 * Method for handling move item event
 */
rtpg.list.onMoveItem = function(evt) {
  var oldIndex = $(rtpg.list.INPUT_SELECTOR + ' .active').index(),
      newIndex = parseInt($(rtpg.list.MOVE_CONTENT_SELECTOR).val());

  if (newIndex <= $(rtpg.list.INPUT_SELECTOR).children().length &&
          newIndex >= 0) {
    rtpg.list.field.move(oldIndex, newIndex);
    rtpg.list.updateUi();
  } else {
    alert('Index is out of bounds');
  }
};

rtpg.list.onRealtimeAdded = function(evt) {
  rtpg.list.updateUi();
  rtpg.log.logEvent(evt, 'List Items Added');
};

rtpg.list.onRealtimeRemoved = function(evt) {
  rtpg.list.updateUi();
  rtpg.log.logEvent(evt, 'List Items Removed');
};

rtpg.list.onRealtimeSet = function(evt) {
  rtpg.list.updateUi();
  rtpg.log.logEvent(evt, 'List Item Set');
};

rtpg.list.connectUi = function() {
  $(rtpg.list.INPUT_SELECTOR).change(rtpg.list.onSelect);
  $(rtpg.list.ADD_SELECTOR).click(rtpg.list.onAddItem);
  $(rtpg.list.REMOVE_SELECTOR).click(rtpg.list.onRemoveItem);
  $(rtpg.list.CLEAR_SELECTOR).click(rtpg.list.onClearList);
  $(rtpg.list.SET_SELECTOR).click(rtpg.list.onSetItem);
};

/**
 * Method to handle realtime reference shifted events
 */
rtpg.list.onRealtimeReferenceShifted = function(evt) {
  var log = rtpg.getCollaborator(evt.sessionId).displayName +
      ' moved cursor from ' + evt.oldIndex + ' to ' + evt.newIndex;
  rtpg.log.logEvent(evt, log);
  rtpg.list.updateUi();
};


/**
 * Method to handle realtime cursor changes
 */
rtpg.list.onRealtimeCursorChange = function(evt) {
  console.log('Cursor Change Event');
  if(evt.newValue){
    evt.newValue.addEventListener(gapi.drive.realtime.EventType.REFERENCE_SHIFTED,
      rtpg.list.onRealtimeReferenceShifted);
  }
  rtpg.list.updateUi();
};

/**
 * Sets up listeners on elements
 */
rtpg.list.connectUi = function() {
  $(rtpg.list.INPUT_SELECTOR + ' li').on('click', rtpg.list.onSelect);
  $(rtpg.list.ADD_SELECTOR).on('click', rtpg.list.onAddItem);
  $(rtpg.list.REMOVE_SELECTOR).on('click', rtpg.list.onRemoveItem);
  $(rtpg.list.CLEAR_SELECTOR).on('click', rtpg.list.onClearList);
  $(rtpg.list.SET_SELECTOR).on('click', rtpg.list.onSetItem);
  $(rtpg.list.MOVE_SELECTOR).on('click', rtpg.list.onMoveItem);
};

rtpg.list.connectRealtime = function() {
  rtpg.list.field.addEventListener(
    gapi.drive.realtime.EventType.VALUES_ADDED, rtpg.list.onRealtimeAdded);
  rtpg.list.field.addEventListener(
    gapi.drive.realtime.EventType.VALUES_REMOVED, rtpg.list.onRealtimeRemoved);
  rtpg.list.field.addEventListener(
    gapi.drive.realtime.EventType.VALUES_SET, rtpg.list.onRealtimeSet);

  if (rtpg.list.cursors) {
    rtpg.list.cursors.addEventListener(
      gapi.drive.realtime.EventType.VALUE_CHANGED,
      rtpg.list.onRealtimeCursorChange);
  }
};
