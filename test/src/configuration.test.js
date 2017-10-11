import configuration from "../../lib/configuration";
import settings from "../../lib/settings";
import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import _ from "lodash";

chai.use(chaiAsPromise);

const expect = chai.expect;
const assert = chai.assert;

describe("Configuration", () => {
  afterEach(() => {
    settings.config.testobjectOutboundProxy = null;
  });

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
        to_devices: "Samsung_Galaxy_S7_real"
      };

      it("succeed", () => {
        let argvMock = {
          to_devices: "Samsung_Galaxy_S7_real",
          to_app_id: "40"
        };
        let envMock = {
          TESTOBJECT_USERNAME: "FAKE_USERNAME",
          TESTOBJECT_API_KEY: "FAKE_ACCESSKEY",
          TESTOBJECT_OUTBOUND_PROXY: "FAKE_PROXY"
        };

        const config = configuration.validateConfig({}, argvMock, envMock);

        expect(config.accessAPI).to.equal("FAKE_ACCESSKEY");
        expect(config.accessUser).to.equal("FAKE_USERNAME");
        expect(config.testobjectOutboundProxy).to.equal("FAKE_PROXY");
        expect(config.appID).to.equal("40");
      });

      it("set via cmd line args", () => {
        let argvMock = {
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

      it("co-existence of --to_device and --to_devices", () => {
        let argvMock = {
          to_devices: "Samsung_Galaxy_S7_real",
          to_device: "Samsung_Galaxy_S7_real"
        };
        let envMock = {
          TESTOBJECT_USERNAME: "FAKE_USERNAME",
          TESTOBJECT_API_KEY: "FAKE_ACCESSKEY"
        };

        try {
          configuration.validateConfig({}, argvMock, envMock);
          assert(false, "TestObject shouldn't pass verification.");
        } catch (e) {
          expect(e.message).to.equal("--to_devices and --to_device cannot co-exist in the arguments");
        }
      });

      it("co-existence of --to_device and --to_platform_name", () => {
        let argvMock = {
          to_devices: "Samsung_Galaxy_S7_real",
          to_platform_name: "Android",
        };
        let envMock = {
          TESTOBJECT_USERNAME: "FAKE_USERNAME",
          TESTOBJECT_API_KEY: "FAKE_ACCESSKEY"
        };

        try {
          configuration.validateConfig({}, argvMock, envMock);
          assert(false, "TestObject shouldn't pass verification.");
        } catch (e) {
          expect(e.message).to.equal("--to_devices and --to_platform_name or --to_platform_name "
            + "cannot co-exist in the arguments");
        }
      });


      it("--to_tunnel_id is set", () => {
        let argvMock = {
          to_devices: "Samsung_Galaxy_S7_real",
          to_tunnel_id: "FAKE_TUNNEL_ID"
        };
        let envMock = {
          TESTOBJECT_USERNAME: "FAKE_USERNAME",
          TESTOBJECT_API_KEY: "FAKE_ACCESSKEY"
        };

        const config = configuration.validateConfig({}, argvMock, envMock);

        expect(config.accessAPI).to.equal("FAKE_ACCESSKEY");
        expect(config.accessUser).to.equal("FAKE_USERNAME");
        expect(config.useTunnels).to.equal(false);
        expect(config.tunnel.tunnelIdentifier).to.equal("FAKE_TUNNEL_ID");
        expect(config.tunnel.restUrl).to.not.equal(null);
      });

      it("--to_create_tunnel is set", () => {
        let argvMock = {
          to_devices: "Samsung_Galaxy_S7_real",
          to_create_tunnel: true
        };
        let envMock = {
          TESTOBJECT_USERNAME: "FAKE_USERNAME",
          TESTOBJECT_API_KEY: "FAKE_ACCESSKEY",
          TESTOBJECT_PASSWORD: "FAKE_PASSWORD"
        };

        const config = configuration.validateConfig({}, argvMock, envMock);

        expect(config.accessAPI).to.equal("FAKE_ACCESSKEY");
        expect(config.accessUser).to.equal("FAKE_USERNAME");
        expect(config.tunnel.username).to.equal("FAKE_USERNAME");
        expect(config.tunnel.password).to.equal("FAKE_PASSWORD");
        expect(config.useTunnels).to.equal(true);
        expect(config.tunnel.tunnelIdentifier).to.not.equal(null);
        expect(config.tunnel.restUrl).to.not.equal(null);
      });


      it("--to_create_tunnel is set without TESTOBJECT_PASSWORD", () => {
        let argvMock = {
          to_devices: "Samsung_Galaxy_S7_real",
          to_create_tunnel: true,
          to_password: "FAKE_PASSWORD"
        };
        let envMock = {
          TESTOBJECT_USERNAME: "FAKE_USERNAME",
          TESTOBJECT_API_KEY: "FAKE_ACCESSKEY"
        };

        const config = configuration.validateConfig({}, argvMock, envMock);

        expect(config.accessAPI).to.equal("FAKE_ACCESSKEY");
        expect(config.accessUser).to.equal("FAKE_USERNAME");
        expect(config.tunnel.username).to.equal("FAKE_USERNAME");
        expect(config.tunnel.password).to.equal("FAKE_PASSWORD");
        expect(config.useTunnels).to.equal(true);
        expect(config.tunnel.tunnelIdentifier).to.not.equal(null);
        expect(config.tunnel.restUrl).to.not.equal(null);
      });

      it("co-existence of --to_tunnel_id and --to_create_tunnel", () => {
        let argvMock = {
          to_devices: "Samsung_Galaxy_S7_real",
          to_tunnel_id: "FAKE_TUNNEL_ID",
          to_create_tunnel: true
        };
        let envMock = {
          TESTOBJECT_USERNAME: "FAKE_USERNAME",
          TESTOBJECT_API_KEY: "FAKE_ACCESSKEY",
          TESTOBJECT_PASSWORD: "FAKE_PASSWORD"
        };

        const config = configuration.validateConfig({}, argvMock, envMock);
      });

      it("--to_create_tunnel without TESTOBJECT_PASSWORD", () => {
        let argvMock = {
          to_devices: "Samsung_Galaxy_S7_real",
          to_create_tunnel: true
        };
        let envMock = {
          TESTOBJECT_USERNAME: "FAKE_USERNAME",
          TESTOBJECT_API_KEY: "FAKE_ACCESSKEY"
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