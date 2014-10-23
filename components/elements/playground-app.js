Polymer({
  ready: function () {
    this.util = this.$.globals.util;
    this.Movie = this.$.globals.Movie;
    this.onAuthComplete = this.onAuthComplete.bind(this);
    this.onFileLoaded = this.onFileLoaded.bind(this);
    this.$.globals.util.authorize(this.onAuthComplete, false);
    gapi.load('picker', {'callback': this.onPickerApiLoad});
  },

  onAuthComplete: function (authResult) {
    if (!authResult || authResult.error) {
      this.authorized = false;
      this.$.subtitle.textContent = "Click to authenticate"
    } else {
      this.authorized = true;
      this.documentId = this.util.getParam('id');
      if(!this.documentId){
        var state = this.util.getParam('state');
        if(state){
          state = state.replace(/%22/g,'"')
                        .replace(/%7B/g,'{')
                        .replace(/%7D/g,'}')
                        .replace(/%5B/g,'[')
                        .replace(/%5D/g,']');
          state = JSON.parse(state);
          this.documentId = state.ids[0];
          window.history.pushState("object or string", "Title", "?id=" + this.documentId);
        }
      }
      this.registerTypes();
      if(this.documentId){
        this.util.load(this.documentId, this.onFileLoaded, function() {});
      } else {
        this.$.app.selected = 1;  
      }
    }
  },

  authorize: function () {
    if(this.authorized === false){
      this.$.globals.util.authorize(this.onAuthComplete, true);  
    }
  },

  onFileLoaded: function (doc) {
    this.onDocumentLoaded(null, {
      doc: doc,
      documentTitle: 'noTitle...',
      documentId: this.documentId
    });
  },

  onDocumentLoaded: function (evt, data) {
    this.shadowRoot.querySelector('realtime-demos').document = data.doc;
    this.shadowRoot.querySelector('realtime-demos').documentId = data.documentId;
    this.$.app.selected = 2;
  },

  back: function () {
    this.$.app.selected = 1;
  },

  registerTypes: function () {
    if(this.typesRegistered){
      return;
    }
    this.typesRegistered = true;

    // Register type of custom object
    try {
      var custom = gapi.drive.realtime.custom;
      custom.registerType(this.Movie, 'DemoMovie');
      this.Movie.prototype.name = custom.collaborativeField('name');
      this.Movie.prototype.director = custom.collaborativeField('director');
      this.Movie.prototype.notes = custom.collaborativeField('notes');
      this.Movie.prototype.rating = custom.collaborativeField('rating');
      custom.setInitializer(this.Movie, this.Movie.prototype.initialize);
    } catch (e) {
      return;
    }
  }
});