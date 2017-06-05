import _ from "lodash";
import { argv } from "yargs";
import logger from "testarmada-logger";

import settings from "./settings";
import Muffin from "./muffin";

export default {
  getNightwatchConfig: (profile) => {
    logger.prefix = "TestObject Executor";

    const config = {
      desiredCapabilities: profile.desiredCapabilities
    };

    logger.debug(`executor config: ${JSON.stringify(config)}`);
    return config;
  },

  getProfiles: (opts, argvMock = null) => {
    logger.prefix = "TestObject Executor";

    let runArgv = argv;

    if (argvMock) {
      runArgv = argvMock;
    }

    return new Promise((resolve) => {
      if (runArgv.to_device) {
        const p = {
          desiredCapabilities: {
            testobject_api_key: settings.config.accessAPI,
            testobject_device: runArgv.to_device
          },
          executor: "testobject",
          nightwatchEnv: "testobject",
          id: runArgv.to_device
        };

        if (settings.config.appID) {
          p.desiredCapabilities.testobject_app_id = settings.config.appID;
        }

        logger.debug(`detected profile: ${JSON.stringify(p)}`);

        resolve(p);
      } else if (runArgv.to_devices) {
        const tempDevices = runArgv.to_devices.split(",");
        const returnDevices = [];

        _.forEach(tempDevices, (device) => {
          const b = device.trim();
          const p = {
            desiredCapabilities: {
              testobject_api_key: settings.config.accessAPI,
              testobject_device: b
            },
            executor: "testobject",
            nightwatchEnv: "testobject",
            // id is for magellan reporter
            id: b
          };

          if (settings.config.appID) {
            p.desiredCapabilities.testobject_app_id = settings.config.appID;
          }

          returnDevices.push(p);
        });

        logger.debug(`detected profiles: ${JSON.stringify(returnDevices)}`);

        resolve(returnDevices);
      } else {
        resolve();
      }
    });

  },

  /*eslint-disable global-require*/
  getCapabilities: (profile, opts) => {
    logger.prefix = "TestObject Executor";

    return new Promise((resolve, reject) => {
      const id = profile.browser;
      try {
        const desiredCapabilities = {
          testobject_api_key: settings.config.accessAPI,
          testobject_app_id: settings.config.appID,
          testobject_device: id
        };
        // add executor info back to capabilities

        if (profile.resolution) {
          desiredCapabilities.resolution = profile.resolution;
        }

        if (profile.orientation) {
          desiredCapabilities.deviceOrientation = profile.orientation;
        }
        const p = {
          desiredCapabilities,
          executor: profile.executor,
          nightwatchEnv: profile.executor,
          id
        };

        resolve(p);
      } catch (e) {
        reject(`Executor TestObject cannot resolve profile 
            ${JSON.stringify(profile)}`);
      }
    });
  },

  /*eslint-disable global-require*/
  listDevices: (opts, callback) => {
    logger.prefix = "TestObject Executor";

    Muffin
      .initialize()
      .then((devices) => {
        const table = Muffin.cliList();
        logger.loghelp(table.toString());
        callback(null, devices);
      })
      .catch((err) => {
        logger.err(`Couldn't fetch TestObject devices. Error: ${err}`);
        logger.err(err.stack);
        callback(err);
      });
  }
};
