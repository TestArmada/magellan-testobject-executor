import _ from "lodash";
import { argv } from "yargs";
import logger from "testarmada-logger";

import settings from "./settings";

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
      if (runArgv.to_browser) {
        const p = {
          desiredCapabilities: {
            testobject_api_key: settings.config.accessAPI,
            testobject_device: runArgv.to_browser
          },
          executor: "testobject",
          nightwatchEnv: "testobject",
          id: runArgv.to_browser
        };

        if (settings.config.appID) {
          p.desiredCapabilities.testobject_app_id = settings.config.appID;
        }

        logger.debug(`detected profile: ${JSON.stringify(p)}`);

        resolve(p);
      } else if (runArgv.to_browsers) {
        const tempBrowsers = runArgv.to_browsers.split(",");
        const returnBrowsers = [];

        _.forEach(tempBrowsers, (browser) => {
          const b = browser.trim();
          const p = {
            desiredCapabilities: {
              testobject_api_key: settings.config.accessAPI,
              testobject_device: b
            },
            executor: "browserstack",
            nightwatchEnv: "browserstack",
            // id is for magellan reporter
            id: b
          };

          if (settings.config.appID) {
            p.desiredCapabilities.testobject_app_id = settings.config.appID;
          }

          returnBrowsers.push(p);
        });

        logger.debug(`detected profiles: ${JSON.stringify(returnBrowsers)}`);

        resolve(returnBrowsers);
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
  listBrowsers: (opts, callback) => {
    logger.prefix = "TestObject Executor";

    if (opts.settings.testFramework.profile
      && opts.settings.testFramework.profile.listBrowsers) {
      // if framework plugin knows how to list browsers

      const listedBrowsers = opts.settings.testFramework.profile.listBrowsers();
      logger.log(`Available browsers: ${listedBrowsers.join(",")}`);

      return callback();
    } else {
      // if framework plugin doesn't know how to list browsers
      return callback();
    }
  }
};
