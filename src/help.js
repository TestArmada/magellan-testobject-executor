export default {
  "to_browser": {
    "visible": true,
    "type": "string",
    "example": "browsername",
    "description": "String represents one browser which TestObject supports"
  },
  "to_browsers": {
    "visible": true,
    "type": "string",
    "example": "b1,b2,..",
    "description": "String represents multiple browsers which TestObject supports"
  },
  "to_list_browsers": {
    "visible": true,
    "type": "function",
    "description": "List the available browsers TestObject supports."
  },
  "to_api_key": {
    "visible": false,
    "type": "string",
    "example": "asfd89123uohasd89",
    "description": "API key string"
  },
  "to_app_id": {
    "visible": true,
    "type": "string",
    "example": "1",
    "description": "APP id of the uploaded app to TestObject"
  }
};
