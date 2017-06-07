import configuration from "../../lib/configuration";
import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import _ from "lodash";

chai.use(chaiAsPromise);

const expect = chai.expect;
const assert = chai.assert;

describe("Configuration", () => {
  it("getConfig", () => {
    const config = configuration.getConfig();

    expect(config.accessUser).to.equal(null);
    expect(config.accessAPI).to.equal(null);
    expect(config.appID).to.equal(null);
  });

  describe("validateConfig", () => {
    it("Executor disabled", () => {
      let argvMock = {};

      const config = configuration.validateConfig({}, {}, {});

      expect(config.accessUser).to.equal(undefined);
      expect(config.accessAPI).to.equal(undefined);
      expect(config.appID).to.equal(undefined);
    });

    describe("executor enabled", () => {
      let argvMock = {
        to_devices: "Samsung_Galaxy_S7_real",
        to_device: "Samsung_Galaxy_S7_real"
      };

      it("succeed", () => {
        let argvMock = {
          to_devices: "Samsung_Galaxy_S7_real",
          to_device: "Samsung_Galaxy_S7_real",
          to_app_id: "40"
        };
        let envMock = {
          TESTOBJECT_USERNAME: "FAKE_USERNAME",
          TESTOBJECT_API_KEY: "FAKE_ACCESSKEY"
        };

        const config = configuration.validateConfig({}, argvMock, envMock);

        expect(config.accessAPI).to.equal("FAKE_ACCESSKEY");
        expect(config.accessUser).to.equal("FAKE_USERNAME");
        expect(config.appID).to.equal("40");
      });

      it("set via cmd line args", () => {
        let argvMock = {
          to_devices: "Samsung_Galaxy_S7_real",
          to_device: "Samsung_Galaxy_S7_real",
          to_app_id: "40",
          to_api_key: "FAKE_ACCESSKEY",
          to_username: "FAKE_USERNAME"
        };
        let envMock = {};

        const config = configuration.validateConfig({}, argvMock, envMock);

        expect(config.accessAPI).to.equal("FAKE_ACCESSKEY");
        expect(config.accessUser).to.equal("FAKE_USERNAME");
        expect(config.appID).to.equal("40");
      });

      it("missing TESTOBJECT_USERNAME", () => {
        let envMock = {
          // TESTOBJECT_USERNAME: "FAKE_USERNAME",
          TESTOBJECT_API_KEY: "FAKE_ACCESSKEY"
        };

        try {
          configuration.validateConfig({}, argvMock, envMock);
          assert(false, "TestObject config shouldn't pass verification.");
        } catch (e) {
          expect(e.message).to.equal("Missing configuration for TestObject connection.");
        }
      });

      it("missing TESTOBJECT_API_KEY", () => {
        let envMock = {
          TESTOBJECT_USERNAME: "FAKE_USERNAME"
          // TESTOBJECT_API_KEY: "FAKE_ACCESSKEY"
        };

        try {
          configuration.validateConfig({}, argvMock, envMock);
          assert(false, "TestObject shouldn't pass verification.");
        } catch (e) {
          expect(e.message).to.equal("Missing configuration for TestObject connection.");
        }
      });
    });
  });
});