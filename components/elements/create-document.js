Polymer({
  ready: function () {
    this.util = this.$.globals.util;
    this.Movie = this.$.globals.Movie;
    this.onFileLoaded = this.onFileLoaded.bind(this);
    this.onInitialize = this.onInitialize.bind(this);
    this.callback = this.callback.bind(this);
  },

  onCreateDriveDocumentClick: function () {
    this.$.createPage.selected = 1;
  },

  createDriveDocument: function () {
    var that = this;
    this.$.create.disabled = true;
    this.documentTitle = this.$.name.value;
    this.$.loader1.classList.remove('hidden');
    this.util.createRealtimeFile(this.documentTitle, function (resp) {
      that.documentId = resp.result.id;
      that.util.load(that.documentId, that.onFileLoaded, that.onInitialize);
    });
    
  },

  onOpenDriveDocumentClick: function () {
    var token = gapi.auth.getToken().access_token;
    var view = new google.picker.View(google.picker.ViewId.DOCS);
    view.setMimeTypes("application/vnd.google-apps.drive-sdk." + this.util.options.appId);
    var picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .setAppId(this.util.options.appId)
        .setOAuthToken(token)
        .addView(view)
        .addView(new google.picker.DocsUploadView())
        .setCallback(this.callback)
        .build();
    picker.setVisible(true);
    this.$.createPage.selected = 2;
  },

  callback: function (resp) {
    if(resp.action == google.picker.Action.PICKED){
      this.documentId = resp.docs[0].id;
      this.util.load(this.documentId, this.onFileLoaded, this.onInitialize);
    } else if (resp.action == google.picker.Action.CANCEL) {
      this.back();
    }
  },

  back: function () {
    this.$.createPage.selected = 0;
  },

  onFileLoaded: function (doc) {
    this.$.createPage.selected = 0;
    this.$.loader1.classList.add('hidden');
    this.$.name.value = '';
    this.$.create.disabled = false;
    var serverUrl = this.util.getParam('serverUrl');
    window.history.pushState("object or string", "Title", "?id=" + this.documentId + (serverUrl ? "serverUrl=" + serverUrl : ""));
    this.fire('core-signal', { 
      name:'file-loaded', 
      data: { 
        doc: doc,
        documentTitle: this.documentTitle,
        documentId: this.documentId
      }
    });

    var that = this;
    setTimeout(function(){
      that.back();  
    }, 1000);
    
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