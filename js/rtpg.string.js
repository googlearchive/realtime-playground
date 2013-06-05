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
 * Namespace for String Demo.
 */
rtpg.string = rtpg.string || {};

rtpg.allDemos.push(rtpg.string);

/**
 * Realtime model's field name for String Demo.
 */
rtpg.string.FIELD_NAME = 'demo_string';

/**
 * Realtime model's field for String Demo.
 */
rtpg.string.field = null;
rtpg.string.referenceStart = null;
rtpg.string.referenceEnd = null;

/**
 * Starting value of field for String Demo.
 */
rtpg.string.START_VALUE = 'Edit Me!';

/**
 * DOM selector for the input element for String Demo.
 */
rtpg.string.INPUT_SELECTOR = '#demoStringInput';


rtpg.string.loadField = function() {
  rtpg.string.field = rtpg.getField(rtpg.string.FIELD_NAME);
  rtpg.string.referenceStart = rtpg.string.field.registerReference(0, false);
  rtpg.string.referenceEnd = rtpg.string.field.registerReference(0, false);
}

rtpg.string.initializeModel = function(model) {
  var field = model.createString(rtpg.string.START_VALUE);
  model.getRoot().set(rtpg.string.FIELD_NAME, field);
}

rtpg.string.updateUi = function() {
  $(rtpg.string.INPUT_SELECTOR).val(rtpg.string.field.getText());
};

rtpg.string.onInput = function(evt) {
  var newValue = $(rtpg.string.INPUT_SELECTOR).val();
  rtpg.string.field.setText(newValue);
};

rtpg.string.onRealtimeInsert = function(evt) {
  rtpg.string.updateUi();
  rtpg.log.logEvent(evt, "String Inserted");
};

rtpg.string.onRealtimeDelete = function(evt) {
  rtpg.string.updateUi();
  rtpg.log.logEvent(evt, "String Deleted");
};

rtpg.string.onReferenceStartShifted = function(evt) {
  if(!evt.isLocal && $(rtpg.string.INPUT_SELECTOR).get(0).setSelectionRange) {
    $(rtpg.string.INPUT_SELECTOR).get(0).setSelectionRange(evt.newIndex, $(rtpg.string.INPUT_SELECTOR).get(0).selectionEnd);
  }
  if ($(rtpg.string.INPUT_SELECTOR).get(0).selectionStart != $(rtpg.string.INPUT_SELECTOR).get(0).selectionEnd) {
    rtpg.log.logEvent(evt, "Selection Start Postion Shifted");
  }
};

rtpg.string.onReferenceEndShifted = function(evt) {
  if(!evt.isLocal && $(rtpg.string.INPUT_SELECTOR).get(0).setSelectionRange) {
    $(rtpg.string.INPUT_SELECTOR).get(0).setSelectionRange($(rtpg.string.INPUT_SELECTOR).get(0).selectionStart, evt.newIndex);
  }

  if ($(rtpg.string.INPUT_SELECTOR).get(0).selectionStart == $(rtpg.string.INPUT_SELECTOR).get(0).selectionEnd) {
    rtpg.log.logEvent(evt, "Cursor Position Shifted");
  } else {
    rtpg.log.logEvent(evt, "Selection End Postion Shifted");
  }
};

rtpg.string.updateReference = function(evt) {
  var indexStart = $(rtpg.string.INPUT_SELECTOR).get(0).selectionStart;
  var indexEnd = $(rtpg.string.INPUT_SELECTOR).get(0).selectionEnd;
  if (rtpg.string.referenceEnd.index != indexEnd) {
    rtpg.string.referenceEnd.index = indexEnd;
  }
  if (rtpg.string.referenceStart.index != indexStart) {
    rtpg.string.referenceStart.index = indexStart;
  }
};

rtpg.string.connectUi = function() {
  $(rtpg.string.INPUT_SELECTOR).keyup(rtpg.string.onInput);
  $(rtpg.string.INPUT_SELECTOR).click(rtpg.string.updateReference);
  $(rtpg.string.INPUT_SELECTOR).keyup(rtpg.string.updateReference);
};


rtpg.string.connectRealtime = function() {
  rtpg.string.field.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, rtpg.string.onRealtimeInsert);
  rtpg.string.field.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, rtpg.string.onRealtimeDelete);
  rtpg.string.referenceStart.addEventListener(gapi.drive.realtime.EventType.REFERENCE_SHIFTED, rtpg.string.onReferenceStartShifted);
  rtpg.string.referenceEnd.addEventListener(gapi.drive.realtime.EventType.REFERENCE_SHIFTED, rtpg.string.onReferenceEndShifted);
};
