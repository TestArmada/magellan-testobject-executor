import { argv } from "yargs";

const debug = argv.debug;

const config = {
  accessAPI: null,
  appID: null
};

export default {
  debug,
  config
};


const a = {
  "appiumVersion": "1.6.4",
  "platformName": "iOS",
  "platformVersion": "10.1",
  "deviceName": "iPhone 7 Plus",
  "sendKeyStrategy": "setValue",
  "waitForAppScript": "true",
  "app": "./app/Walmart.app",
  "testobject_api_key": "BE73DF565090424DA1D6E32EBEF6C1BE",
  "testobject_app_id": "25",
  "testobject_device": "iPhone_7_Plus_10_1_wm14",
  "testobject_appium_version": "1.6.4",
  "testobject_suite_name": "walmart_app.zip-2017-05-16T13:38:10-07:00",
  "testobject_test_name": "Search tests Check Special Offers filter in Refine Section - CLEARANCE - [C813177] @automationSpecific"
}