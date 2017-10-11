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
  "to_password": {
    "visible": false,
    "type": "string",
    "example": "sd9f81l",
    "description": "Your TestObject password, for creating tunnel"
  },
  "to_create_tunnel": {
    "visible": true,
    "type": "boolean",
    "description": "Create and use sauce tunnel for testing"
  },
  "to_tunnel_id": {
    "visible": true,
    "type": "string",
    "description": "Existing tunnel identifier for testing"
  },
  "to_app_id": {
    "visible": true,
    "type": "string",
    "example": "1",
    "description": "APP id of the uploaded app to TestObject"
  },
  "to_platform_name": {
    "visible": true,
    "type": "string",
    "example": "iOS",
    "description": "String represents the mobile platform"
  },
  "to_platform_version": {
    "visible": true,
    "type": "string",
    "example": "10.2",
    "description": "String represents the mobile platform version"
  }
};
