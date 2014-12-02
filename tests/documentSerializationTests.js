var APP_ID_KEY = 'appId',
    REVISION_KEY = 'revision',
    BOOLEAN_KEY = 'boolean',
    BOOLEAN_VAL = true,
    DOUBLE_KEY = 'double',
    DOUBLE_VAL = 3.2,
    STRING_KEY = 'string',
    STRING_VAL = '<hi>',
    ROOT_VAL = 'root',
    JSON_TYPE = 'json',
    MAP_TYPE_VALUE = 'Map',
    LIST_TYPE_VALUE = 'List',
    STRING_TYPE_VALUE = 'EditableString',
    INDEX_REFERENCE_TYPE_VALUE = 'IndexReference',
    INDEX_REFERENCE_OBJECT_ID_KEY = 'objectId',
    INDEX_REFERENCE_INDEX_KEY = 'index',
    INDEX_REFERENCE_CAN_BE_DELETED_KEY = 'canBeDeleted',
    OBJECT_VALUE_KEY = 'value',
    OBJECT_ID_KEY = 'id',
    OBJECT_TYPE_KEY = 'type',
    REFERENCE_KEY = 'ref';
    JSON_TYPE = 'json';

window.testSuite.load(new TestingClass('Document Serialization', 'documentSerializationTests.js')
  .reset({
    run: function () {
      window.inMemoryDocument = null;
      gapi.drive.realtime.newInMemoryDocument(function(doc){ 
        window.inMemoryDocument = doc;
      })
    },
    assert: function () {
      return !!window.inMemoryDocument;
    }
  })
  .test({
    description: 'Simple Map of Json',
    run: function () {
      window.inMemoryDocument.getModel().getRoot().set(BOOLEAN_KEY, BOOLEAN_VAL);
      window.inMemoryDocument.getModel().getRoot().set(STRING_KEY, STRING_VAL);
      window.inMemoryDocument.getModel().getRoot().set(DOUBLE_KEY, DOUBLE_VAL);
    },
    assert: function () {
      var json = JSON.parse(window.inMemoryDocument.getModel().toJson());
      return json[OBJECT_ID_KEY] == 'root' &&
        json[OBJECT_TYPE_KEY] == 'Map' &&
        json[OBJECT_VALUE_KEY][DOUBLE_KEY][JSON_TYPE] === DOUBLE_VAL &&
        json[OBJECT_VALUE_KEY][STRING_KEY][JSON_TYPE] === STRING_VAL &&
        json[OBJECT_VALUE_KEY][BOOLEAN_KEY][JSON_TYPE] === BOOLEAN_VAL;
    }
  })
  .test({
    description: 'Cyclical Document',
    run: function () {
      var model = window.inMemoryDocument.getModel()
      var map1 = model.createMap();
      var map2 = model.createMap();
      map1.set('looseCycle', map2);
      map2.set('looseCycle', model.getRoot());
      model.getRoot().set('tightCycle', model.getRoot());
      model.getRoot().set('looseCycle', map1);
    },
    assert: function () {
      var json = JSON.parse(window.inMemoryDocument.getModel().toJson());
      var root = json[OBJECT_VALUE_KEY];
      return inMemoryDocument.getModel().getRoot().get('looseCycle').getId() === root.looseCycle[OBJECT_ID_KEY] &&
        root.looseCycle[OBJECT_TYPE_KEY] === MAP_TYPE_VALUE &&
        inMemoryDocument.getModel().getRoot().get('looseCycle').get('looseCycle').getId() === root.looseCycle[OBJECT_VALUE_KEY].looseCycle[OBJECT_ID_KEY] &&
        root.looseCycle[OBJECT_VALUE_KEY].looseCycle[OBJECT_TYPE_KEY] === MAP_TYPE_VALUE &&
        root.looseCycle[OBJECT_VALUE_KEY].looseCycle[OBJECT_VALUE_KEY].looseCycle[REFERENCE_KEY] === ROOT_VAL &&
        root.tightCycle[REFERENCE_KEY] === ROOT_VAL;
    }
  })
  .test({
    description: 'Serializing Index References',
    run: function () {
      var model = window.inMemoryDocument.getModel();
      var list = model.createList(['1','2']);
      var ref1 = list.registerReference(0, false);
      var ref2 = list.registerReference(1, true);
      model.getRoot().set('list', list);
      model.getRoot().set('ref1', ref1);
      model.getRoot().set('ref2', ref2);
    },
    assert: function () {
      var json = JSON.parse(window.inMemoryDocument.getModel().toJson());
      var root = json[OBJECT_VALUE_KEY];
      var array = root.list[OBJECT_VALUE_KEY];
      var model = window.inMemoryDocument.getModel();
      var ref1 = root.ref1[OBJECT_VALUE_KEY];
      var ref2 = root.ref2[OBJECT_VALUE_KEY];

      return json[OBJECT_ID_KEY] === ROOT_VAL &&
        json[OBJECT_TYPE_KEY] === MAP_TYPE_VALUE &&
        model.getRoot().get('list').getId() === root.list[OBJECT_ID_KEY] &&
        root.list[OBJECT_TYPE_KEY] === LIST_TYPE_VALUE &&
        array[0][JSON_TYPE] === model.getRoot().get('list').get(0) &&
        array[1][JSON_TYPE] === model.getRoot().get('list').get(1) &&
        root.ref1[OBJECT_TYPE_KEY] === INDEX_REFERENCE_TYPE_VALUE &&
        root.ref2[OBJECT_TYPE_KEY] === INDEX_REFERENCE_TYPE_VALUE &&
        ref1[INDEX_REFERENCE_OBJECT_ID_KEY] === model.getRoot().get('list').getId() &&
        ref2[INDEX_REFERENCE_OBJECT_ID_KEY] === model.getRoot().get('list').getId() &&
        ref1[INDEX_REFERENCE_INDEX_KEY] == 0 &&
        ref2[INDEX_REFERENCE_INDEX_KEY] == 1 &&
        ref1[INDEX_REFERENCE_CAN_BE_DELETED_KEY] == false &&
        ref2[INDEX_REFERENCE_CAN_BE_DELETED_KEY] == true;
    }
  })
.test({
  description: 'Serializing Collaborative String',
  run: function () {
    window.inMemoryDocument.getModel().getRoot().set('str', window.inMemoryDocument.getModel().createString('Hello World'));
  },
  assert: function () {
    var json = JSON.parse(window.inMemoryDocument.getModel().toJson());
    var root = json[OBJECT_VALUE_KEY];
    var model = window.inMemoryDocument.getModel();

    return root.str[OBJECT_ID_KEY] === model.getRoot().get('str').getId() &&
      root.str[OBJECT_TYPE_KEY] === STRING_TYPE_VALUE &&
      root.str[OBJECT_VALUE_KEY] === "Hello World";
  }
})
.test({
  description: 'Serialized Document Retains AppId & Revision',
  run: function () {},
  assert: function () {
    var json = JSON.parse(doc.getModel().toJson('666', 3));
    return json[APP_ID_KEY] === '666' &&
      json[REVISION_KEY] === 3;
  }
})
.test({
  description: 'Serializing Collaborative Lists',
  run: function () {
    var model = window.inMemoryDocument.getModel();
    model.getRoot().set('list2', model.createList(['"ha"', { inner: 'testvalue' }]));
  },
  assert: function () {
    var json = JSON.parse(window.inMemoryDocument.getModel().toJson());
    var root = json[OBJECT_VALUE_KEY];
    var model = window.inMemoryDocument.getModel();
    var values = root.list2[OBJECT_VALUE_KEY];

    return root.list2[OBJECT_ID_KEY] === model.getRoot().get('list2').getId() &&
      root.list2[OBJECT_TYPE_KEY] === LIST_TYPE_VALUE &&
      values[0][JSON_TYPE] === '"ha"' &&
      values[1][JSON_TYPE]['inner'] === 'testvalue';
  }
}));