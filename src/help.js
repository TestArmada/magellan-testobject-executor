export default {
  "to_device": {
    "visible": true,
    "type": "string",
    "example": "devicename",
    "description": "String represents one device which TestObject supports"
  },
  "to_devices": {
    "visible": true,
    "type": "string",
    "example": "d1,d2,..",
    "description": "String represents multiple devices which TestObject supports"
  },
  "to_list_devices": {
    "visible": true,
    "type": "function",
    "description": "List the available devices TestObject supports."
  },
  "to_api_key": {
    "visible": false,
    "type": "string",
    "example": "asfd89123uohasd89",
    "description": "API key string"
  },
  "to_username": {
    "visible": false,
    "type": "string",
    "example": "mikebrown",
    "description": "Your TestObject username"
  },
  "to_app_id": {
    "visible": true,
    "type": "string",
    "example": "1",
    "description": "APP id of the uploaded app to TestObject"
  }
};
