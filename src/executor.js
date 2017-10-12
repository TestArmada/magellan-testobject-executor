import { fork } from "child_process";
import request from "request";
import logger from "testarmada-logger";

import settings from "./settings";
import Tunnel from "./tunnel";

let config = settings.config;

let tunnel = null;

const Executor = {
  /*eslint-disable no-unused-vars*/
  setupRunner: (mocks = null) => {
    return Executor
      .setupTunnels(mocks);
  },

  setupTunnels: (mocks = null) => {
    logger.prefix = "TestObject Executor";

    let ITunnel = Tunnel;

    if (mocks) {
      if (mocks.Tunnel) {
        ITunnel = mocks.Tunnel;
      }
      if (mocks.config) {
        config = mocks.config;
      }
    }

    if (config.useTunnels) {
      // create new tunnel if needed
      tunnel = new ITunnel(config);

      return tunnel
        .initialize()
        .then(() => {
          return tunnel.open();
        })
        .then(() => {
          logger.log("Sauce tunnel is opened!  Continuing...");
          logger.log(`Assigned tunnel [${config.tunnel.tunnelIdentifier}] to all workers`);
        })
        .catch((err) => {
          return new Promise((resolve, reject) => {
            reject(err);
          });
        });
    } else {
      return new Promise((resolve) => {
        if (config.tunnel.tunnelIdentifier) {
          const tunnelAnnouncement = config.tunnel.tunnelIdentifier;

          logger.log(`Connected to sauce tunnel [${tunnelAnnouncement}]`);
        } else {
          logger.log("Connected to TestObject without tunnel");
        }
        return resolve();
      });
    }
  },

  /*eslint-disable no-unused-vars*/
  teardownRunner: (mocks = null) => {
    logger.prefix = "TestObject Executor";

    if (mocks && mocks.config) {
      config = mocks.config;
    }

    // close tunnel if needed
    if (tunnel && config.useTunnels) {
      return tunnel
        .close()
        .then(() => {
          logger.log("Sauce tunnel is closed!  Continuing...");
        });
    } else {
      return new Promise((resolve) => {
        resolve();
      });
    }
  },

  setupTest: (callback) => {
    callback();
  },

  teardownTest: (info, callback) => {
    callback();
  },

  execute: (testRun, options, mocks = null) => {
    let ifork = fork;

    if (mocks && mocks.fork) {
      ifork = mocks.fork;
    }

    return ifork(testRun.getCommand(), testRun.getArguments(), options);
  },

  /* eslint-disable consistent-return */
  summerizeTest: (magellanBuildId, testResult, callback) => {
    logger.prefix = "TestObject Executor";

    let additionalLog = "";

    if (!testResult.metadata) {
      // testarmada-nightwatch-extra isn't in use, users need
      // to report result to saucelabs by themselves
      logger.warn("No meta data is found, executor will not report result to TestObject."
        + " This is mainly caused by not using https://github.com/TestArmada/nightwatch-extra");
      return callback();
    }
    setTimeout(() => {
      try {
        const sessionId = testResult.metadata.sessionId;

        logger.debug(`TestObject replay can be found `
          + `at ${testResult.metadata.capabilities.testobject_test_report_url}\n`);

        if (!testResult.result) {
          // print out sauce replay to console if test failed
          additionalLog = logger.warn(`TestObject replay can be found `
            + `at ${testResult.metadata.capabilities.testobject_test_report_url}\n`);
        }

        const options = {
          method: "PUT",
          url: `https://app.testobject.com/api/rest/v1/appium/session/${sessionId}/test`,
          body: JSON.stringify({ "passed": testResult.result }),
          headers: {
            "Content-Type": "application/json"
          }
        };

        if (settings.config.testobjectOutboundProxy) {
          options.proxy = settings.config.testobjectOutboundProxy;
          options.strictSSL = false;
        }

        logger.debug(`Request: ${JSON.stringify(options)}`);

        return request(options, (err, response, b) => {
          if (err) {
            logger.err(`problem with request: ${err}`);
            return callback();
          }

          logger.debug(`Response: ${JSON.stringify(response)}`);

          return callback(additionalLog);
        });

      } catch (err) {
        logger.err(`Error ${err}`);
        return callback();
      }
    }, settings.TESTOBJECT_API_DELAY);
  }

};

module.exports = Executor;
