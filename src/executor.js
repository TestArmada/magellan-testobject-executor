import { fork } from "child_process";
import request from "request";
import logger from "testarmada-logger";

import settings from "./settings";

export default {
  /*eslint-disable no-unused-vars*/
  setupRunner: (mocks = null) => {
    return new Promise((resolve) => {
      resolve();
    });
  },

  /*eslint-disable no-unused-vars*/
  teardownRunner: (mocks = null) => {
    return new Promise((resolve) => {
      resolve();
    });
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
