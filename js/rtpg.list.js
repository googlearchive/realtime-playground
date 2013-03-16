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
 * Namespace for List Demo.
 */
rtpg.list = rtpg.list || {};

rtpg.allDemos.push(rtpg.list);

/**
 * Realtime model's field name for List Demo.
 */
rtpg.list.FIELD_NAME = 'demo_list';

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
 * DOM selector for the input element for List Demo.
 */
rtpg.list.INPUT_SELECTOR = '#demoListInput';


rtpg.list.loadField = function() {
  rtpg.list.field = rtpg.getField(rtpg.list.FIELD_NAME);
}


rtpg.list.initializeModel = function(model) {
  var field = model.createList();
  field.pushAll(rtpg.list.START_VALUE);
  model.getRoot().set(rtpg.list.FIELD_NAME, field);
}

rtpg.list.updateUi = function() {
  $(rtpg.list.INPUT_SELECTOR).empty();
  var array = rtpg.list.field.asArray();
  for (var i in array) {
    var newOption = $('<option>').val(array[i]).text('\xa0\xa0' + array[i]);
    $(rtpg.list.INPUT_SELECTOR).append(newOption);
  }
};

rtpg.list.onClearList = function() {
  rtpg.list.field.clear();
};

rtpg.list.onSetItem = function() {
  var newValue = $(rtpg.list.SET_CONTENT_SELECTOR).val();
  var indexToSet = $(rtpg.list.INPUT_SELECTOR).prop("selectedIndex");
  if (newValue != '' && indexToSet != -1) {
    rtpg.list.field.set(indexToSet, newValue);
  }
};

rtpg.list.onRemoveItem = function() {
  var indexToRemove = $(rtpg.list.INPUT_SELECTOR).prop("selectedIndex");
  rtpg.list.field.remove(indexToRemove);
};


rtpg.list.onAddItem = function() {
  var newValue = $(rtpg.list.ADD_CONTENT_SELECTOR).val();
  if (newValue != '') {
    rtpg.list.field.push(newValue);
  }
}


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


rtpg.list.connectRealtime = function() {
  rtpg.list.field.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, rtpg.list.onRealtimeAdded);
  rtpg.list.field.addEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, rtpg.list.onRealtimeRemoved);
  rtpg.list.field.addEventListener(gapi.drive.realtime.EventType.VALUES_SET, rtpg.list.onRealtimeSet);
};
