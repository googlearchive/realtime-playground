Polymer({
  ready: function () {
    this.util = this.$.globals.util;
    this.Movie = this.$.globals.Movie;
    this.onInitialize = this.onInitialize.bind(this);
    this.importFile = this.importFile.bind(this);
    this.$.fileImport.addEventListener('change', this.importFile, false);
  },

  onCreateLocalDocumentClick: function () {
    var that = this;
    gapi.drive.realtime.newInMemoryDocument(function (doc) {
      that.fireNewDocumentSignal(doc);
    }, that.onInitialize);
  },

  back: function () {
    this.$.createPage.selected = 0;
  },

    // Import/Export Methods
  import: function () {
    this.$.fileImport.click();
  },

  importFile: function (e) {
    var that = this;
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      var contents = e.target.result;
      try {
        var doc = gapi.drive.realtime.loadFromJson(contents);
        that.fireNewDocumentSignal(doc);
      } catch (e) {
        alert(e.message);
      }
    };
    reader.readAsText(file);
  },

  fireNewDocumentSignal: function (doc) {
    this.fire('core-signal', {
      name:'file-loaded', 
      data: { 
        doc: doc,
        documentTitle: "Local-only Document",
        documentId: 0
      }
    });
  },

  onInitialize: function (model) {
    
    // String Initializer
    var collaborativeString = model.createString('Edit Me!');
    model.getRoot().set('demo_string', collaborativeString);

    // List Initializer
    var collaborativeList = model.createList();
    collaborativeList.pushAll(['Cat', 'Dog', 'Sheep', 'Chicken']);
    model.getRoot().set('demo_list', collaborativeList);

    var cursorsMap = model.createMap();
    model.getRoot().set('demo_cursors', cursorsMap);

    // Map Initializer
    var collaborativeMap = model.createMap({
      key1: "value 1",
      key2: "value 2",
      key3: "value 3"
    });
    model.getRoot().set('demo_map', collaborativeMap);

    var customObject = model.create(this.Movie, 'Minority Report', 'Steven Spielberg');
    model.getRoot().set('demo_custom', customObject);

  }
});