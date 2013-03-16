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
 * Namespace for Custom Demo.
 */
rtpg.custom = rtpg.custom || {};

rtpg.allDemos.push(rtpg.custom);

/**
 * Realtime model's field name for Custom Demo.
 */
rtpg.custom.FIELD_NAME = 'demo_custom';

/**
 * Realtime model's field for Custom Demo.
 */
rtpg.custom.field = null;

/**
 * Class definition of the custom object.
 */
rtpg.custom.Movie = function() {};
rtpg.custom.Movie.prototype.initialize = function(name, director) {
  this.name = name;
  this.director = director;
  this.notes = '';
  this.rating = '';
};

/**
 * Starting value of field for Custom Demo.
 */
rtpg.custom.START_VALUE = {
  name: 'Kung Fu Hustle',
  director: 'Stephen Chow',
  notes: '',
  rating: '',
};


/**
 * DOM selector for the Container element for Custom Demo.
 */
rtpg.custom.OUTPUT_SELECTOR = '#demoCustomContainer';


/**
 * DOM selector for the input element for Custom Demo.
 */
rtpg.custom.INPUT_NAME_SELECTOR = '#demoCustomName';
rtpg.custom.INPUT_DIRECTOR_SELECTOR = '#demoCustomDirector';
rtpg.custom.INPUT_NOTES_SELECTOR = '#demoCustomNotes';
rtpg.custom.INPUT_RATING_SELECTOR = '#demoCustomRating';


rtpg.custom.loadField = function() {
  rtpg.custom.field = rtpg.getField(rtpg.custom.FIELD_NAME);
}

rtpg.custom.initializeModel = function(model) {
  var start = rtpg.custom.START_VALUE;
  var field = model.create(rtpg.custom.Movie, start.name, start.director);
  model.getRoot().set(rtpg.custom.FIELD_NAME, field);
}

rtpg.custom.registerTypes = function() {
  var Movie = rtpg.custom.Movie;
  var custom = gapi.drive.realtime.custom;
  custom.registerType(Movie, 'DemoMovie');
  Movie.prototype.name = custom.collaborativeField('name');
  Movie.prototype.director = custom.collaborativeField('director');
  Movie.prototype.notes = custom.collaborativeField('notes');
  Movie.prototype.rating = custom.collaborativeField('rating');
  custom.setInitializer(Movie, Movie.prototype.initialize);
}

rtpg.custom.updateUi = function() {
  $(rtpg.custom.INPUT_NAME_SELECTOR).val(rtpg.custom.field.name);
  $(rtpg.custom.INPUT_DIRECTOR_SELECTOR).val(rtpg.custom.field.director);
  $(rtpg.custom.INPUT_NOTES_SELECTOR).val(rtpg.custom.field.notes);
  $(rtpg.custom.INPUT_RATING_SELECTOR).val(rtpg.custom.field.rating);
};

rtpg.custom.onNameInput = function(evt) {
  var newValue = $(rtpg.custom.INPUT_NAME_SELECTOR).val();
  rtpg.custom.field.name = newValue;
};

rtpg.custom.onRealtimeChange = function(evt) {
  rtpg.custom.updateUi();
  rtpg.log.logEvent(evt, 'Custom Object Property Changed');
};

rtpg.custom.onDirectorInput = function(evt) {
  var newValue = $(rtpg.custom.INPUT_DIRECTOR_SELECTOR).val();
  rtpg.custom.field.director = newValue;
};

rtpg.custom.onNotesInput = function(evt) {
  var newValue = $(rtpg.custom.INPUT_NOTES_SELECTOR).val();
  rtpg.custom.field.notes = newValue;
};

rtpg.custom.onRatingInput = function(evt) {
  var newValue = $(rtpg.custom.INPUT_RATING_SELECTOR).val();
  rtpg.custom.field.rating = newValue;
};

rtpg.custom.connectUi = function() {
  $(rtpg.custom.INPUT_NAME_SELECTOR).keyup(rtpg.custom.onNameInput);
  $(rtpg.custom.INPUT_DIRECTOR_SELECTOR).keyup(rtpg.custom.onDirectorInput);
  $(rtpg.custom.INPUT_NOTES_SELECTOR).keyup(rtpg.custom.onNotesInput);
  $(rtpg.custom.INPUT_RATING_SELECTOR).keyup(rtpg.custom.onRatingInput);
};

rtpg.custom.connectRealtime = function() {
  rtpg.custom.field.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, rtpg.custom.onRealtimeChange);
};
