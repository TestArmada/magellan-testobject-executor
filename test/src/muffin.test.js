import muffin from "../../lib/muffin";
import settings from "../../lib/settings";
import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import _ from "lodash";

chai.use(chaiAsPromise);

const expect = chai.expect;
const assert = chai.assert;

describe("Muffin", function () {
  this.timeout(60000);
  afterEach(() => {
    settings.config.testobjectOutboundProxy = null;
  });

  describe("initialize", () => {
    it("force no cache", () => {
      return muffin
        .initialize(true)
        .then(devices => {
          expect(_.keys(devices).length).to.greaterThan(0);
        });
    });


    it("configuration validation error", () => {
      let envMock = {
        TESTOBJECT_USERNAME: "FAKE_USERNAME"
      };

      let argvMock = {
        to_device: "Samsung_Galaxy_S7_real"
      };

      return muffin
        .initialize(true, argvMock, envMock)
        .then(browsers => {
          assert(false, "shouldn't be here");
        })
        .catch(err => {
          expect(err.message).to.match(/^Missing configuration for TestObject connection/);
        });
    });
  });

  it("get", () => {
    return muffin
      .initialize()
      .then(() => {
        expect(muffin.get("FAKE_ID")).to.equal("FAKE_ID");
      });
  });
});
