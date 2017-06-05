import _ from "lodash";
import request from "request";
import Table from "cli-table";
import clc from "cli-color";
import logger from "testarmada-logger";
import configuration from "./configuration";

const TESTOBJECT_API_URL = "https://app.testobject.com/api/rest/devices/v1/devices/all/available";
let deviceCache = {};


export default {
  initialize(ignoreCache = false, argvMock = null, envMock = null) {
    const self = this;
    let config = null;

    return new Promise((resolve, reject) => {
      if (!ignoreCache
        && _.keys(deviceCache).length > 0) {
        resolve(deviceCache);
      } else {
        try {
          config = configuration.validateConfig({}, argvMock, envMock);
        } catch (e) {
          reject(e);
        }
        const options = {
          "headers": {
            "Accept": "application/json",
            "x-api-key": config.accessAPI
          }
        };

        request.get(TESTOBJECT_API_URL, options, (err, response, body) => {
          console.log("======>", err, body)
          if (err) {
            reject(err);
          }

          self._buildDeviceCache(JSON.parse(body));
          resolve(deviceCache);
        });
      }
    });
  },

  get(id) {
    if (_.keys(deviceCache).length > 0) {
      return deviceCache[id];
    }

    return null;
  },

  cliList() {
    const self = this;

    if (_.keys(deviceCache).length > 0) {
      logger.loghelp("Available TestObject Device:");

      const families = _.groupBy(deviceCache, (capabilities) => capabilities.browser);
      const table = new Table({
        head: ["Family", "Alias", "Browser/Env", "Version", "OS", "OS Version", "Device"]
      });

      let count = 1;

      Object.keys(families).sort().forEach((family) => {
        table.push([clc.red(_.capitalize(family))]);
        const currentFamily = families[family];

        _.forEach(currentFamily, (capabilities) => {
          const key = self._generateKey(capabilities);
          table.push([
            clc.blackBright(`${count}.`),
            key,
            _.capitalize(capabilities.browser),
            capabilities.browser_version ? capabilities.browser_version : "N/A",
            _.capitalize(capabilities.os),
            capabilities.os_version,
            capabilities.device ? capabilities.device : "N/A"
          ]);
          count++;
        });
      });

      return table;
    }

    return null;
  },

  _generateKey(capabilities) {
    const values = [];

    values.push(capabilities.browser);

    if (capabilities.browser_version) {
      values.push(capabilities.browser_version);
    }

    values.push(capabilities.os);
    values.push(capabilities.os_version);

    if (capabilities.device) {
      values.push(capabilities.device);
    }

    const key = values.join("_").replace(/(\.|\s)/g, "_");
    return key;
  },

  _buildDeviceCache(testobjectResponse) {
    const self = this;
    deviceCache = {};

    _.forEach(testobjectResponse, (capabilities) => {
      const key = self._generateKey(capabilities);
      deviceCache[key] = capabilities;
    });

  }
};