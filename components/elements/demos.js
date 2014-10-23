// Collaborative String

var app = {};

function onInitialize (model) {
  // String Initializer
  var collaborativeString = model.createString('Edit Me!');
  model.getRoot().set('demo_string', collaborativeString);
}

function onFileLoaded (doc) {
  app.doc = doc;
  app.stringDemo = doc.getModel().getRoot().get('demo_string');
  setup();
}

function setup () {
  app.stringDemo.addEventListener(
    gapi.drive.realtime.EventType.TEXT_INSERTED,
    onStringChange);
  app.stringDemo.addEventListener(
    gapi.drive.realtime.EventType.TEXT_DELETED,
    onStringChange);
}

function onStringChange (evt) {
  if(evt.isLocal){
    // No need to update the UI here since we caused the event
  } else {
    document.querySelector('.string-demo').value = app.stringDemo.getText();
  }
}





// Collaborative List

var app = {};

function onInitialize (model) {
  var collaborativeList = model.createList();
  collaborativeList.pushAll(['Cat', 'Dog', 'Sheep', 'Chicken']);
  model.getRoot().set('demo_list', collaborativeList);
}

function onFileLoaded (doc) {
  app.doc = doc;
  app.listDemo = doc.getModel().getRoot().get('demo_list');
  setup();
}

function setup () {
  app.listDemo.addEventListener(
    gapi.drive.realtime.EventType.VALUES_ADDED,
    onListChange);
  app.listDemo.addEventListener(
    gapi.drive.realtime.EventType.VALUES_REMOVED,
    onListChange);
  app.listDemo.addEventListener(
    gapi.drive.realtime.EventType.VALUES_SET,
    onListChange);
}

function onListChange (evt) {
  // Update the UI, etc.
}








// Collaborative Map
var app = {};

function onInitialize (model) {
  var collaborativeMap = model.createMap({
    key1: "value 1",
    key2: "value 2",
    key3: "value 3"
  });
  model.getRoot().set('demo_map', collaborativeMap);
}

function onFileLoaded (doc) {
  app.doc = doc;
  app.mapDemo = doc.getModel().getRoot().get('demo_map');
  setup();
}

function setup () {
  this.mapDemo.addEventListener(
    gapi.drive.realtime.EventType.VALUE_CHANGED,
    this.onMapValueChanged);
}

function onMapValueChanged (evt) {
  var property = evt.property; // Which property changed
  var oldValue = evt.oldValue; // Previous map value for this property
  var newValue = evt.newValue; // New map value for this property
}

// A method to demonstrate getting all the values from a map
function getValues () {
  var keys = app.mapDemo.keys();
  var values = [];
  for(var i = 0; i < keys.length; i++){
    values.push(app.mapDemo.get(keys[i]));
  }
  return values;
}




// Custom Object
var app = {};

var Movie = function () {};

Movie.prototype = {
  initialize: function (name, director) {
    this.name = name;
    this.director = director;
    this.notes = '';
    this.rating = '';
  }
}

// You must register the custom object before loading or creating any file that
// uses this custom object.
function registerTypes () {
  var custom = gapi.drive.realtime.custom;
  custom.registerType(Movie, 'DemoMovie');
  Movie.prototype.name = custom.collaborativeField('name');
  Movie.prototype.director = custom.collaborativeField('director');
  Movie.prototype.notes = custom.collaborativeField('notes');
  Movie.prototype.rating = custom.collaborativeField('rating');
  custom.setInitializer(Movie, Movie.prototype.initialize);
}

function onInitialize (model) {
  var customObject = model.create(Movie, 'Minority Report', 'Steven Spielberg');
  model.getRoot().set('demo_custom', customObject);
}

function onFileLoaded (doc) {
  app.doc = doc;
  app.customDemo = doc.getModel().getRoot().get('demo_custom');
  setup();
}

function setup () {
  app.customDemo.addEventListener(
    gapi.drive.realtime.EventType.VALUE_CHANGED,
    onCustomDemoChange);
}

// Below we look at just the director field, but you would need to update the UI for all fields
function onCustomDemoChange (evt) {
  var input = document.querySelector('#directorInput');
  input.value = app.customDemo.director;
}

function onDirectorKeyup () {
  app.customDemo.director = document.querySelector('#directorInput').value;
  // This will fire a change event
}