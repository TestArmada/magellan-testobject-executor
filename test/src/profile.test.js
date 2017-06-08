import profile from "../../lib/profile";
import configuration from "../../lib/configuration";
import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import _ from "lodash";

chai.use(chaiAsPromise);

const expect = chai.expect;
const assert = chai.assert;

describe("Profile", function () {
  this.timeout(60000);

  describe("getProfiles", () => {

    it("with to_device with device", () => {
      let argvMock = {
        to_device: "Samsung_Galaxy_S7_real",
        to_app_id: "1"
      };

      configuration.validateConfig({ isEnabled: true }, argvMock);

      return profile
        .getProfiles({}, argvMock)
        .then((profile) => {
          expect(profile.desiredCapabilities.testobject_device).to.equal("Samsung_Galaxy_S7_real");
          expect(profile.desiredCapabilities.testobject_api_key).to.equal(process.env.TESTOBJECT_API_KEY);
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
          expect(profiles.length).to.equal(2);
          expect(profiles[0].desiredCapabilities.testobject_device).to.equal("Samsung_Galaxy_S7_real");
          expect(profiles[0].desiredCapabilities.testobject_api_key).to.equal(process.env.TESTOBJECT_API_KEY);
          expect(profiles[0].executor).to.equal("testobject");
          expect(profiles[0].nightwatchEnv).to.equal("testobject");
          expect(profiles[0].id).to.equal("Samsung_Galaxy_S7_real");
          expect(profiles[1].desiredCapabilities.testobject_device).to.equal("Asus_Google_Nexus_7_real");
          expect(profiles[1].desiredCapabilities.testobject_api_key).to.equal(process.env.TESTOBJECT_API_KEY);
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
        "executor": "testobject"
      };

      return profile
        .getCapabilities(p)
        .then((profile) => {
          expect(profile.desiredCapabilities.testobject_device).to.equal("Asus_Google_Nexus_7_real");
          expect(profile.desiredCapabilities.testobject_api_key).to.equal(process.env.TESTOBJECT_API_KEY);
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
    const config = profile.getNightwatchConfig({
      desiredCapabilities: {
        "testobject_device": "Asus_Google_Nexus_7_real",
        "testobject_api_key": "FAKE_KEY"
      }
    });

    expect(config.desiredCapabilities.testobject_device).to.equal("Asus_Google_Nexus_7_real");
    expect(config.desiredCapabilities.testobject_api_key).to.equal("FAKE_KEY");
  });
});