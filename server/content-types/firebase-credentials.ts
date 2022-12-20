const schema = {
  kind: 'singleType',
  info: {
    "displayName": "Firebase Credentials",
    "singularName": "firebase-credentials",
    "pluralName": "firebase-credentials",
    "description": "Firebase project credentials",
    "tableName": "firebase_credentials",
  },
  options: {
    "privateAttributes": ["id", "created_at"],
    "populateCreatorFields": true,
    "draftAndPublish": false
  },
  pluginOptions: {
    "content-manager": {
      "visible": false
    },
    "content-type-builder": {
      "visible": false
    }
  },
  attributes: {
    credentials: {
      "type": "json",
      "configurable": false,
      "required": true,
      "default": null
    },
  }
}

export default schema;
