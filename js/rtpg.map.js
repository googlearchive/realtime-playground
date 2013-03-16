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
 * Namespace for Map Demo.
 */
rtpg.map = rtpg.map || {};

rtpg.allDemos.push(rtpg.map);

/**
 * Realtime model's field name for Map Demo.
 */
rtpg.map.FIELD_NAME = 'demo_map';

/**
 * Realtime model's field for Map Demo.
 */
rtpg.map.field = null;

rtpg.map.START_KEYS = ({"Key 1":"Value 1", "Key 2":"Value 2", "Key 3":"Value 3", "Key 4":"Value 4"});

/**
 * DOM selector for the elements for Map Demo.
 */
rtpg.map.MAP_KEYS_SELECTOR = '#demoMapKeys';
rtpg.map.MAP_VALUES_SELECTOR = '#demoMapValues';
rtpg.map.REMOVE_SELECTOR = '#demoMapRemove';
rtpg.map.CLEAR_SELECTOR = '#demoMapClear';
rtpg.map.PUT_SELECTOR = '#demoMapPut';
rtpg.map.PUT_KEY_SELECTOR = '#demoMapKey';
rtpg.map.PUT_VALUE_SELECTOR = '#demoMapValue';


rtpg.map.loadField = function() {
  rtpg.map.field = rtpg.getField(rtpg.map.FIELD_NAME);
}


rtpg.map.initializeModel = function(model) {
  var field = model.createMap(rtpg.map.START_KEYS);
  for (var key in rtpg.map.START_KEYS) {
    field.set(key, rtpg.map.START_KEYS[key]);
  }
  model.getRoot().set(rtpg.map.FIELD_NAME, field);
}


rtpg.map.updateUi = function() {
  $(rtpg.map.MAP_KEYS_SELECTOR).empty();
  $(rtpg.map.MAP_VALUES_SELECTOR).empty();
  var keys = rtpg.map.field.keys();
  keys.sort();
  var l = keys.length;
  for (var i=0; i < l; i++) {
    var key = keys[i];
    var val = rtpg.map.field.get(key);
    var newOptionKey = $('<option>').val(key).text('\xa0\xa0' + key);
    var newOptionValue = $('<option>').val(val).text('\xa0\xa0' + val);
    $(rtpg.map.MAP_KEYS_SELECTOR).append(newOptionKey);
    $(rtpg.map.MAP_VALUES_SELECTOR).append(newOptionValue);
  }
  l = l <= 1 ? 2 : l;
  $(rtpg.map.MAP_KEYS_SELECTOR).attr('size', l);
  $(rtpg.map.MAP_VALUES_SELECTOR).attr('size', l);
}


rtpg.map.onRealtime = function(evt) {
  rtpg.map.updateUi();
  rtpg.log.logEvent(evt, 'Map Value Changed');
};


rtpg.map.onRemoveItem = function(evt) {
  var key = $(rtpg.map.MAP_KEYS_SELECTOR).val();
  if (key != null) {
    rtpg.map.field.delete(key);
  }
};


rtpg.map.onClearMap = function(evt) {
  rtpg.map.field.clear();
};

rtpg.map.onPutMap = function(evt) {
  var key = $(rtpg.map.PUT_KEY_SELECTOR).val();
  var val = $(rtpg.map.PUT_VALUE_SELECTOR).val();
  rtpg.map.field.set(key, val);
};


rtpg.map.connectUi = function() {
  $(rtpg.map.REMOVE_SELECTOR).click(rtpg.map.onRemoveItem);
  $(rtpg.map.CLEAR_SELECTOR).click(rtpg.map.onClearMap);
  $(rtpg.map.PUT_SELECTOR).click(rtpg.map.onPutMap);
};


rtpg.map.connectRealtime = function() {
  rtpg.map.field.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, rtpg.map.onRealtime);
};
