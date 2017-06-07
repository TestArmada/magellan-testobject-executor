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

  summerizeTest: (magellanBuildId, testResult, callback) => {
    logger.prefix = "TestObject Executor";

    const additionalLog = "";

    if (!testResult.metadata) {
      // testarmada-nightwatch-extra isn't in use, users need
      // to report result to saucelabs by themselves
      logger.warn("No meta data is found, executor will not report result to saucelabs");
      return callback();
    }
    try {
      const sessionId = testResult.metadata.sessionId;

      const uri = `https://app.testobject.com/api/rest/v1/appium/session/${sessionId}/test`;
      const body = JSON.stringify({
        "passed": testResult.result
      });

      const auth = {
        user: settings.config.accessUser,
        password: settings.config.accessAPI
      };

      logger.debug("Data posting to TestObject job:");
      logger.debug(JSON.stringify(body));
      logger.debug(`Updating TestObject ${uri}`);

      // request.debug = true;
      return request({
        uri,
        auth,
        body,
        strictSSL: false,
        json: true,
        method: "PUT"
      }, (err, response, b) => {
        if (err) {
          logger.err(`problem with request: ${err}`);
          return callback();
        }

        logger.debug(`Response: ${response.statusCode}`);
        logger.debug(`Header  : ${JSON.stringify(response.headers)}`);
        logger.debug(`Body  : ${JSON.stringify(b)}`);

        return callback(additionalLog);
      });

    } catch (err) {
      logger.err(`Error ${err}`);
      return callback();
    }
  }

};
