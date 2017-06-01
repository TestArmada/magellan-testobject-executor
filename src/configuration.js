import { argv } from "yargs";
import _ from "lodash";
import path from "path";
import logger from "testarmada-logger";
import settings from "./settings";

export default {
  getConfig: () => {
    return settings.config;
  },

  /*eslint-disable no-unused-vars*/
  validateConfig: (opts, argvMock = null, envMock = null) => {
    logger.prefix = "TestObject Executor";

    let runArgv = argv;
    let env = process.env;

    if (argvMock) {
      runArgv = argvMock;
    }

    if (envMock) {
      env = envMock;
    }

    // required
    if (env.TESTOBJECT_ACCESS_API) {
      settings.config.accessAPI = env.TESTOBJECT_ACCESS_API;
    }

    // optional
    if (runArgv.to_app_id) {
      settings.config.appID = runArgv.to_app_id;
    }

    const parameterWarnings = {
      accessAPI: {
        required: true,
        envKey: "TESTOBJECT_ACCESS_API"
      }
    };

    if (runArgv.to_browsers
      || runArgv.to_browser
      || opts.isEnabled) {
      let valid = true;

      _.forEach(parameterWarnings, (v, k) => {
        if (!settings.config[k]) {
          if (v.required) {
            logger.err(`Error! TestObject requires ${k} to be set. Check if the`
              + ` environment variable $${v.envKey} is defined.`);
            valid = false;
          } else {
            logger.warn(`Warning! No ${k} is set. This is set via the`
              + ` environment variable $${v.envKey} . This isn't required, but can cause `
              + "problems with TestObject if not set");
          }
        }
      });

      if (!valid) {
        throw new Error("Missing configuration for TestObject connection.");
      }

      logger.debug("TestObject configuration: ");
      logger.debug(JSON.stringify(settings.config));

      logger.log("TestObject configuration OK");

      return settings.config;
    }

  }
};
