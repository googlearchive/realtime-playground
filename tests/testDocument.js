
var TestDocument = function (tag) {
  this.tag = tag;
  this.initializeDocument.bind(this);
  this.onFileLoaded.bind(this);
}

TestDocument.prototype = {

  initializeDocument: function (model) {
    model.getRoot().set('string', model.createString());
    model.getRoot().set('map', model.createMap());
    model.getRoot().set('list', model.createList());
  },

  onFileLoaded: function (doc) {
    this.doc = doc;
    this.model = doc.getModel();
    this.string = this.model.getRoot().get('string');
    this.map = this.model.getRoot().get('map');
    this.list = this.model.getRoot().get('list');
  },

  load: function (documentId) {
    util.load(documentId, this.onFileLoaded, this.initializeDocument);
  }
}