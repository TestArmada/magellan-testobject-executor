import { argv } from "yargs";
import _ from "lodash";
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
    if (env.TESTOBJECT_API_KEY) {
      settings.config.accessAPI = env.TESTOBJECT_API_KEY;
    }

    if (env.TESTOBJECT_USERNAME) {
      settings.config.accessUser = env.TESTOBJECT_USERNAME;
    }

    // optional
    if (runArgv.to_api_key && !settings.config.accessAPI) {
      // only accept argument from command line if env variable isn't set
      settings.config.accessAPI = runArgv.to_api_key;
    }

    if (runArgv.to_username && !settings.config.accessUser) {
      // only accept argument from command line if env variable isn't set
      settings.config.accessUser = runArgv.to_username;
    }

    if (runArgv.to_app_id) {
      settings.config.appID = runArgv.to_app_id;
    }

    const parameterWarnings = {
      accessAPI: {
        required: true,
        envKey: "TESTOBJECT_API_KEY"
      },
      accessUser: {
        required: true,
        envKey: "TESTOBJECT_USERNAME"
      }
    };

    if (runArgv.to_devices
      || runArgv.to_device
      || runArgv.to_list_devices
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
