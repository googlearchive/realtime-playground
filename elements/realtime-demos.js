Polymer({
  ready: function() {
    this.util = this.$.globals.util;
    this.eventsList = [];
    this.$.drawer.selected = 0;
    this.swipeAnywhere =
      /(iPad|iPhone|iPod touch);.*CPU.*OS (7|8)_\d/i.test(navigator.userAgent);
    this.document = null;
    this.documentTitle = 'loading . . .';
    this.documentTitleBaseUrl = 'https://www.googleapis.com';
    this.setBindings();
    this.$.fileImport.addEventListener('change', this.importFile, false);
    if (this.util.getParam('serverUrl') == 'sandbox') {
      this.documentTitleBaseUrl =
        'https://content-googleapis-test.sandbox.google.com';
    }
  },

  setBindings: function() {
    this.importFile = this.importFile.bind(this);
    this.onUndoRedoStateChanged = this.onUndoRedoStateChanged.bind(this);
    this.onAttributeChange = this.onAttributeChange.bind(this);
    this.onCollaboratorChange = this.onCollaboratorChange.bind(this);
    this.onCollaborativeStringEvent =
      this.onCollaborativeStringEvent.bind(this);
    this.onListChange = this.onListChange.bind(this);
    this.onReferenceShifted = this.onReferenceShifted.bind(this);
    this.onCursorsChange = this.onCursorsChange.bind(this);
    this.onMapValueChanged = this.onMapValueChanged.bind(this);
    this.onCustomDemoChange = this.onCustomDemoChange.bind(this);
  },

  documentChanged: function(evt, doc) {
    this.doc = doc;
    window.doc = doc;
    this.collaborators = doc.getCollaborators();
    this.isInGoogleDrive =
      doc.isInGoogleDrive === undefined ? true : doc.isInGoogleDrive;
    this.isToJsonAvailable = !!doc.getModel().toJson;

    this.model = doc.getModel();

    this.stringDemo = this.model.getRoot().get('demo_string');
    this.listDemo = this.model.getRoot().get('demo_list');
    this.cursorsDemo = this.model.getRoot().get('demo_cursors');
    this.mapDemo = this.model.getRoot().get('demo_map');
    this.customDemo = this.model.getRoot().get('demo_custom');

    this.setupDocument();
    this.setupModel();

    this.setupCollaborators();
    this.setupCollaborativeString();
    this.setupCollaborativeList();
    this.setupCollaborativeMap();

    if (this.customDemo) {
      this.setupCustomObject();
    }

    this.$.drawer.selected = 1;
    this.eventsList = [];
  },

  documentIdChanged: function(evt, id) {
    this.documentTitle = 'loading . . .';
    this.$.driveFileMetadataRequest.params = JSON.stringify({
      access_token: this.util.authorizer.token
    });
    this.$.driveFileMetadataRequest.go();
  },

  handleResponse: function(resp) {
    this.documentTitle = resp.detail.response.title;
  },

  setupDocument: function() {
    this.doc.addEventListener(gapi.drive.realtime.EventType.ATTRIBUTE_CHANGED,
        this.onAttributeChange);
    this.onAttributeChange();
  },

  onAttributeChange: function(evt) {
    this.addEvent(evt);
    this.isReadOnly = this.doc.getModel().isReadOnly;
  },

  setupModel: function() {
    this.doc.getModel().addEventListener(
      gapi.drive.realtime.EventType.UNDO_REDO_STATE_CHANGED,
      this.onUndoRedoStateChanged);
    this.onUndoRedoStateChanged();
  },

  onUndoRedoStateChanged: function(evt) {
    this.addEvent(evt);
    this.canUndo = this.doc.getModel().canUndo;
    this.canRedo = this.doc.getModel().canRedo;
  },


  // Import/Export Methods
  import: function() {
    this.$.fileImport.click();
  },

  importFile: function(e) {
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
        that.documentChanged(null, doc);
      } catch (e) {
        alert(e.message);
      }
    };
    reader.readAsText(file);
  },

  export: function() {
    document.location = 'data:Application/octet-stream,' +
                         encodeURIComponent(this.doc.getModel().toJson());
  },


  // Collaborator Methods
  setupCollaborators: function() {
    this.doc.addEventListener(
      gapi.drive.realtime.EventType.COLLABORATOR_JOINED,
      this.onCollaboratorChange);
    this.doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT,
      this.onCollaboratorChange);
    this.setMyColor();
  },

  onCollaboratorChange: function() {
    this.collaborators = this.doc.getCollaborators();
    this.setMyColor();
    this.garbageCollectCursors();
  },

  setMyColor: function() {
    for (var i = 0; i < this.collaborators.length; i++) {
      if (this.collaborators[i].isMe) {
        this.myColor = this.collaborators[i].color;
      }
    }
  },


  // Collaborative String Methods
  setupCollaborativeString: function() {
    this.stringDemo.addEventListener(
      gapi.drive.realtime.EventType.TEXT_INSERTED,
      this.onCollaborativeStringEvent);
    this.stringDemo.addEventListener(
      gapi.drive.realtime.EventType.TEXT_DELETED,
      this.onCollaborativeStringEvent);
    this.collaborativeString = this.stringDemo.getText();
  },

  onCollaborativeStringEvent: function(evt) {
    this.addEvent(evt);
    this.collaborativeString = this.stringDemo.getText();
  },

  onCollaborativeStringInputChange: function(evt) {
    this.stringDemo.setText(this.$.stringInput.value);
  },


  // Collaborative List Methods
  setupCollaborativeList: function() {
    this.listDemo.addEventListener(
      gapi.drive.realtime.EventType.VALUES_ADDED,
      this.onListChange);
    this.listDemo.addEventListener(
      gapi.drive.realtime.EventType.VALUES_REMOVED,
      this.onListChange);
    this.listDemo.addEventListener(
      gapi.drive.realtime.EventType.VALUES_SET,
      this.onListChange);
    this.cursorsDemo.addEventListener(
      gapi.drive.realtime.EventType.VALUE_CHANGED,
      this.onCursorsChange);
    this.garbageCollectCursors();
    this.collaborativeList = this.listDemo.asArray();
  },

  onListChange: function(evt) {
    this.addEvent(evt);
    this.collaborativeList = this.listDemo.asArray();
  },

  onCursorsChange: function(evt) {
    this.addEvent(evt);
    this.garbageCollectCursors();
  },

  garbageCollectCursors: function() {
    var keys = this.cursorsDemo.keys();
    for (var i = 0; i < keys.length; i++) {
      if (!this.getCollaborator(keys[i])) {
        this.cursorsDemo.delete(keys[i]);
      } else {
        this.cursorsDemo.get(keys[i]).addEventListener(
          gapi.drive.realtime.EventType.REFERENCE_SHIFTED,
          this.onReferenceShifted);
      }
    }
    this.references = this.parseMap(this.cursorsDemo);
    this.updateCursorsUI();
  },

  onRemoveListItemClick: function() {
    this.listDemo.remove(this.getIndex(this.selectedItem));
    this.selectedItem = null;
  },

  onAddListItemClick: function(evt) {
    this.listDemo.push(this.$.addListItemInput.value);
    this.$.addListItemInput.value = '';
  },

  onClearListClick: function() {
    this.listDemo.clear();
    this.selectedItem = null;
  },

  onSetListItemClick: function() {
    this.listDemo.set(this.getIndex(this.selectedItem),
      this.$.setListItemInput.value);
    this.$.setListItemInput.value = '';
  },

  onMoveListItemClick: function() {
    var oldIndex = this.getIndex(this.selectedItem);
    var newIndex = parseInt(this.$.moveListItemInput.value);

    if (newIndex < 0 ||
      newIndex > this.listDemo.asArray().length ||
      oldIndex == newIndex) {
      return;
    }

    this.listDemo.move(oldIndex, newIndex);
    this.$.moveListItemInput.value = '';
  },

  getIndex: function(value) {
    for (var i = 0; i < this.listDemo.asArray().length; i++) {
      if (value == this.listDemo.asArray()[i]) {
        return i;
      }
    }
  },

  onRadioChange: function(evt) {
    if (!this.isInGoogleDrive) {
      return;
    }
    var index = this.getIndex(evt.target.attributes.name.value);
    // Start a non undoable compound operation, we don't want to be able to
    // undo a refrence creation
    this.doc.getModel().beginCompoundOperation('', false);
      if (!this.registeredReference) {
        this.registeredReference = this.listDemo.registerReference(index, true);
        this.registeredReference.addEventListener(
          gapi.drive.realtime.EventType.REFERENCE_SHIFTED,
          this.onReferenceShifted);
        this.cursorsDemo.set(this.getMySessionId(), this.registeredReference);
      }
      this.registeredReference.index = index;
    this.doc.getModel().endCompoundOperation();
  },

  onReferenceShifted: function(evt) {
    this.addEvent(evt);
    this.garbageCollectCursors();
  },

  updateCursorsUI: function() {
    var elements = this.$.listDemoGroup.querySelectorAll('paper-radio-button');
    for (var i = 0; i < elements.length; i++) {
      elements[i].setAttribute('style', '');
    }
    for (var i = 0; i < this.references.length; i++) {
      var index = this.references[i].value.index;
      var collaborator = this.getCollaborator(this.references[i].key);
      var color = collaborator.isMe ? '' : collaborator.color;
      elements[index].setAttribute('style', 'background-color:' + color);
    }
  },

  getMySessionId: function() {
    var collaborators = this.doc.getCollaborators();
    for (var i = 0; i < collaborators.length; i++) {
      if (collaborators[i].isMe) {
        return collaborators[i].sessionId;
      }
    }
  },

  getCollaborator: function(sessionId) {
    var collaborators = this.doc.getCollaborators();
    for (var i = 0; i < collaborators.length; i++) {
      if (collaborators[i].sessionId == sessionId) {
        return collaborators[i];
      }
    }
  },


  // Collaborative Map Methods
  setupCollaborativeMap: function() {
    this.mapDemo.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED,
      this.onMapValueChanged);
    this.collaborativeMap = this.parseMap(this.mapDemo);
  },

  onMapValueChanged: function(evt) {
    this.addEvent(evt);
    this.collaborativeMap = this.parseMap(this.mapDemo);
  },

  parseMap: function(map) {
    var mapArray = [];
    var keys = map.keys();
    for (var i = 0; i < keys.length; i++) {
      mapArray.push({
        key: keys[i],
        value: map.get(keys[i])
      });
    }
    return mapArray;
  },

  onMapItemClick: function(evt, no, el) {
    if (this.isReadOnly) {
      return;
    }
    this.selectedMapItemKey = el.querySelector('.mapKey').textContent;
  },

  onRemoveMapItemClick: function() {
    this.mapDemo.delete(this.selectedMapItemKey);
  },

  onClearMapClick: function() {
    this.mapDemo.clear();
  },

  onAddMapItemClick: function() {
    this.mapDemo.set(this.$.addMapKeyInput.value,
      this.$.addMapValueInput.value);
    this.$.addMapKeyInput.value = '';
    this.$.addMapValueInput.value = '';
  },


  // Custom Object Methods
  setupCustomObject: function() {
    this.customDemo.addEventListener(
      gapi.drive.realtime.EventType.VALUE_CHANGED,
      this.onCustomDemoChange);
    this.setCustomObjectValues();
  },

  onCustomDemoChange: function(evt) {
    this.addEvent(evt);
    this.setCustomObjectValues();
  },

  setCustomObjectValues: function() {
    this.name = this.customDemo.name;
    this.director = this.customDemo.director;
    this.notes = this.customDemo.notes;
    this.rating = this.customDemo.rating;
  },

  onNameInputChange: function() {
    this.customDemo.name = this.$.customNameInput.value;
  },

  onDirectorInputChange: function() {
    this.customDemo.director = this.$.customDirectorInput.value;
  },

  onNotesInputChange: function() {
    this.customDemo.notes = this.$.customNotesInput.value;
  },

  onRatingInputChange: function() {
    this.customDemo.rating = this.$.customRatingInput.value;
  },

  addEvent: function(evt) {
    if (this.eventsList > 100) {
      this.eventsList.pop();
    }
    this.eventsList.unshift(evt);
  },

  openInNewTab: function() {
    var serverUrl = this.util.getParam('serverUrl');
    var documentId = this.util.getParam('id');
    window.open(window.location.origin + '?id=' + documentId +
      (serverUrl ? '&serverUrl=' + serverUrl : ''), '_blank');
  },

  back: function() {
    var destination = this.isInGoogleDrive ? 2 : 1;
    this.fire('core-signal', {
      name: 'back',
      data: {
        destination: destination
      }
    });

    var that = this;

    setTimeout(function() {
      that.$.drawer.selected = 0;
      that.$.demoContainer.setAttribute('tile-cascade', true);
      that.shadowRoot.querySelector('core-drawer-panel').closeDrawer();
    }, 1000);

  },

  share: function() {
    if (!this.shareClient) {
      var shareClient = new gapi.drive.share.ShareClient(
        this.util.appId);
      shareClient.setItemIds([this.documentId]);
    }
    shareClient.showSettingsDialog();
  },

  undo: function() {
    this.doc.getModel().undo();
  },

  redo: function() {
    this.doc.getModel().redo();
  },

  seeCode: function(evt, x, el) {
    var page = 1;
    switch (el.getAttribute('data-code')) {
      case 'string':
        hljs.highlightBlock(this.$.stringSampleCodeBlock);
        page = 2;
        break;
      case 'list':
        hljs.highlightBlock(this.$.listSampleCodeBlock);
        page = 3;
        break;
      case 'map':
        hljs.highlightBlock(this.$.mapSampleCodeBlock);
        page = 4;
        break;
      case 'custom':
        hljs.highlightBlock(this.$.customSampleCodeBlock);
        page = 5;
        break;
    }
    this.$.demoContainer.removeAttribute('tile-cascade');
    this.$.drawer.selected = page;
  },

  demosView: function() {
    this.$.drawer.selected = 1;
  }

});
