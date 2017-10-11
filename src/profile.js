import _ from "lodash";
import { argv } from "yargs";
import logger from "testarmada-logger";

import settings from "./settings";
import Muffin from "./muffin";


/* eslint-disable camelcase */
export default {
  getNightwatchConfig: (profile) => {
    logger.prefix = "TestObject Executor";

    const config = {
      desiredCapabilities: profile.desiredCapabilities
    };

    // For *outbound Selenium control traffic*, Nightwatch supports a proxy
    // property directly on the environment configuration object (note: this is
    // NOT to be confused with proxy settings in desiredCapabilities, which are
    // used for return path traffic from the remote browser).
    if (settings.config.testobjectOutboundProxy) {
      config.proxy = settings.config.testobjectOutboundProxy;
    }

    if (settings.config.tunnel.tunnelIdentifier) {
      // we're told to use tunnel
      config.desiredCapabilities.tunnelIdentifier = settings.config.tunnel.tunnelIdentifier;
    }

    logger.debug(`executor config: ${JSON.stringify(config)}`);
    return config;
  },

  getProfiles: (opts, argvMock = null) => {
    logger.prefix = "TestObject Executor";

    let runArgv = argv;

    if (argvMock) {
      runArgv = argvMock;
    }

    return Muffin
      .initialize(false, argvMock)
      .then(() => {
        return new Promise((resolve) => {
          if (runArgv.to_device) {
            const p = {
              desiredCapabilities: {
                testobjectApiKey: settings.config.accessAPI,
                deviceName: Muffin.get(runArgv.to_device)
              },
              executor: "testobject",
              nightwatchEnv: "testobject",
              id: runArgv.to_device
            };

            if (settings.config.appID) {
              p.desiredCapabilities.testobject_app_id = settings.config.appID;
            }

            if (runArgv.to_platform_name) {
              p.desiredCapabilities.platformName = runArgv.to_platform_name;
            }

            if (runArgv.to_platform_version) {
              p.desiredCapabilities.platformVersion = runArgv.to_platform_version;
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
                  testobjectApiKey: settings.config.accessAPI,
                  deviceName: Muffin.get(b)
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
      });


  },

  /*eslint-disable global-require,no-unused-vars*/
  getCapabilities: (profile, opts) => {
    logger.prefix = "TestObject Executor";

    return Muffin
      .initialize()
      .then(() => {
        return new Promise((resolve, reject) => {
          try {
            const desiredCapabilities = {
              testobjectApiKey: settings.config.accessAPI,
              deviceName: Muffin.get(profile.browser)
            };

            if (settings.config.appID) {
              desiredCapabilities.testobject_app_id = settings.config.appID;
            }

            const p = {
              desiredCapabilities,
              executor: profile.executor,
              nightwatchEnv: profile.executor,
              id: profile.browser
            };

            if (profile.appium) {
              p.desiredCapabilities = _.merge(p.desiredCapabilities, profile.appium);
            }

            logger.debug(`detected profile: ${JSON.stringify(p)}`);

            resolve(p);
          } catch (e) {
            reject(`Executor TestObject cannot resolve profile 
            ${JSON.stringify(profile)}`);
          }
        });
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
