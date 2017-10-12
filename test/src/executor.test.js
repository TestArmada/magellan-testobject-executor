import executor from "../../lib/executor";
import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import _ from "lodash";

chai.use(chaiAsPromise);

const expect = chai.expect;
const assert = chai.assert;

describe("Executor", () => {
  describe("setupRunner", () => {

    let mocks;

    beforeEach(() => {
      mocks = {
        Tunnel: class Tunnel {
          constructor(config) { }
          initialize() { return new Promise((resolve) => resolve()) }
          open() { return new Promise((resolve) => resolve()) }
        },

        config: {
          tunnel: {}
        }
      };
    });

    it("without tunnel", () => {
      mocks.config.useTunnels = false;

      return executor
        .setupRunner(mocks)
        .then()
        .catch(err => assert(false, "executor doesn't setup correctly." + err));
    });

    it("use existing tunnel", () => {
      mocks.config = {
        useTunnels: false,
        tunnel: {
          tunnelIdentifier: "FAKE_ID"
        }
      };

      return executor
        .setupRunner(mocks)
        .then(() => { })
        .catch(err => assert(false, "executor setupRunner isn't successful for use existing tunnel config"));
    });

    it("create new tunnel", () => {
      mocks.config.useTunnels = true;

      return executor
        .setupRunner(mocks)
        .then(() => { })
        .catch(err => assert(false, "executor setupRunner isn't successful for create new tunnel config"));
    });

    it("create new tunnel failed in initialization", () => {
      mocks.config.useTunnels = true;

      mocks.Tunnel = class Tunnel {
        constructor(config) { }
        initialize() { return new Promise((resolve, reject) => reject("initialization error")) }
        open() { return new Promise((resolve) => resolve()) }
      };

      return executor
        .setupRunner(mocks)
        .then(() => assert(false, "executor setupRunner isn't successful"))
        .catch(err => expect(err).to.equal("initialization error"));
    });

    it("create new tunnel failed in open", () => {
      mocks.config.useTunnels = true;

      mocks.Tunnel = class Tunnel {
        constructor(config) { }
        initialize() { return new Promise((resolve) => resolve()) }
        open() { return new Promise((resolve, reject) => reject("open error")) }
      };

      return executor
        .setupRunner(mocks)
        .then(() => assert(false, "executor setupRunner isn't successful"))
        .catch(err => expect(err).to.equal("open error"));
    });
  });

  describe("teardownRunner", () => {
    it("no create tunnel", () => {
      let mocks = {
        Tunnel: class Tunnel {
          constructor(config) { }
          initialize() { return new Promise((resolve) => resolve()) }
          open() { return new Promise((resolve) => resolve()) }
        },

        config: { tunnel: {} }
      };

      return executor
        .teardownRunner(mocks)
        .then()
        .catch(err => assert(false, "executor doesn't teardown correctly." + err));
    });

    it("use tunnel", () => {
      let mocks = {
        Tunnel: class Tunnel {
          constructor(config) { }
          initialize() { return new Promise((resolve) => resolve()) }
          open() { return new Promise((resolve) => resolve()) }
          close() { return new Promise((resolve) => resolve()) }
        },

        config: {
          useTunnels: true,
          tunnel: {
            tunnelIdentifier: null
          }
        }
      };

      return executor
        .setupRunner(mocks)
        .then(() => executor.teardownRunner(mocks))
        .catch(err => assert(false, "executor teardownRunner isn't successful for use tunnel config"));
    });
  });

  it("setupTest", (done) => {
    executor.setupTest(() => {
      assert(true);
      done();
    });
  });

  it("teardownTest", (done) => {
    executor.teardownTest({}, () => {
      assert(true);
      done();
    });
  });

  it("execute", () => {
    const mocks = {
      fork(cmd, args, opts) {
        return 1;
      }
    };

    const testRun = {
      getCommand() { },
      getArguments() { }
    };

    let r = executor.execute(testRun, {}, mocks);
    expect(r).to.equal(1);
  });
});