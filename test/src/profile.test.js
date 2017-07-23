import profile from "../../lib/profile";
import configuration from "../../lib/configuration";
import settings from "../../lib/settings";
import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import _ from "lodash";

chai.use(chaiAsPromise);

const expect = chai.expect;
const assert = chai.assert;

describe("Profile", function () {
  this.timeout(60000);

  afterEach(() => {
    settings.config.testobjectOutboundProxy = null;
  });

  describe("getProfiles", () => {

    it("with to_device with device", () => {
      let argvMock = {
        to_device: "Samsung_Galaxy_S7_real",
        to_platform_name: "Android",
        to_platform_version: "7.0",
        to_app_id: "1"
      };

      configuration.validateConfig({ isEnabled: true }, argvMock);

      return profile
        .getProfiles({}, argvMock)
        .then((profile) => {
          expect(profile.desiredCapabilities.deviceName).to.equal("Samsung_Galaxy_S7_real");
          expect(profile.desiredCapabilities.testobjectApiKey).to.equal(process.env.TESTOBJECT_API_KEY);
          expect(profile.desiredCapabilities.testobject_app_id).to.equal("1");
          expect(profile.executor).to.equal("testobject");
          expect(profile.nightwatchEnv).to.equal("testobject");
          expect(profile.id).to.equal("Samsung_Galaxy_S7_real");
        });
    });

    it("with to_devices", () => {
      let argvMock = {
        to_devices: "Samsung_Galaxy_S7_real, Asus_Google_Nexus_7_real"
      };

      configuration.validateConfig({ isEnabled: true }, argvMock);

      return profile
        .getProfiles({}, argvMock)
        .then((profiles) => {
          console.log(profiles[0])
          expect(profiles.length).to.equal(2);
          expect(profiles[0].desiredCapabilities.deviceName).to.equal("Samsung_Galaxy_S7_real");
          expect(profiles[0].desiredCapabilities.testobjectApiKey).to.equal(process.env.TESTOBJECT_API_KEY);
          expect(profiles[0].executor).to.equal("testobject");
          expect(profiles[0].nightwatchEnv).to.equal("testobject");
          expect(profiles[0].id).to.equal("Samsung_Galaxy_S7_real");
          expect(profiles[1].desiredCapabilities.deviceName).to.equal("Asus_Google_Nexus_7_real");
          expect(profiles[1].desiredCapabilities.testobjectApiKey).to.equal(process.env.TESTOBJECT_API_KEY);
          expect(profiles[1].executor).to.equal("testobject");
          expect(profiles[1].nightwatchEnv).to.equal("testobject");
          expect(profiles[1].id).to.equal("Asus_Google_Nexus_7_real");
        });
    });


    it("without param", () => {
      let argvMock = {};

      return profile
        .getProfiles({}, argvMock)
        .then((thing) => {
          expect(thing).to.equal(undefined);
        });
    });
  });


  describe("getCapabilities", () => {
    it("can resolve device", () => {
      let p = {
        "browser": "Asus_Google_Nexus_7_real",
        "appium": {
          "platformName": "Android",
          "platformVersion": "7.0"
        },
        "executor": "testobject"
      };

      return profile
        .getCapabilities(p)
        .then((profile) => {
          expect(profile.desiredCapabilities.deviceName).to.equal("Asus_Google_Nexus_7_real");
          expect(profile.desiredCapabilities.platformName).to.equal("Android");
          expect(profile.desiredCapabilities.platformVersion).to.equal("7.0");
          expect(profile.desiredCapabilities.testobjectApiKey).to.equal(process.env.TESTOBJECT_API_KEY);
          expect(profile.executor).to.equal("testobject");
          expect(profile.nightwatchEnv).to.equal("testobject");
          expect(profile.id).to.equal("Asus_Google_Nexus_7_real");
        });
    });
  });

  describe("listDevices", () => {
    it("from testobject", (done) => {
      return profile
        .listDevices({}, (err, deviceTable) => {
          expect(err).to.equal(null);
          done();
        });
    });
  });

  describe("getNightwatchConfig", () => {
    settings.config.testobjectOutboundProxy = "FAKE_PROXY";
    
    const config = profile.getNightwatchConfig({
      desiredCapabilities: {
        "deviceName": "Asus_Google_Nexus_7_real",
        "testobjectApiKey": "FAKE_KEY"
      }
    });

    expect(config.desiredCapabilities.deviceName).to.equal("Asus_Google_Nexus_7_real");
    expect(config.desiredCapabilities.testobjectApiKey).to.equal("FAKE_KEY");
    expect(config.proxy).to.equal("FAKE_PROXY");
  });
});