import _ from "lodash";
import request from "request";
import Table from "cli-table";
import clc from "cli-color";
import logger from "testarmada-logger";
import configuration from "./configuration";

const TESTOBJECT_API_URL = "https://app.testobject.com/api/rest/devices/v1/devices";
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
          config = configuration.validateConfig({ isEnabled: true }, argvMock, envMock);
        } catch (e) {
          reject(e);
        }
        const options = {
          "auth": {
            "user": config.accessUser,
            "pass": config.accessAPI,
            "sendImmediately": false
          }
        };

        if (config.testobjectOutboundProxy) {
          options.proxy = config.testobjectOutboundProxy;
          options.strictSSL = false;
        }

        request.get(TESTOBJECT_API_URL, options, (err, response, body) => {
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
      // !!!!!!!!!NOTICE!!!!!!!!!
      // this is only a workaround, right now there is an issue in TestObject API,
      // private devices won't be returnd. once the issue is fixed we need to
      // return the correct value
      // return deviceCache[id];
      return id;
    }

    return null;
  },

  cliList() {
    if (_.keys(deviceCache).length > 0) {
      logger.loghelp("Available TestObject Device:");

      const families = _.groupBy(deviceCache, (details) => details.os);
      const table = new Table({
        head: ["Family", "ID", "Manufacturer", "OS", "OS Version", "API Level", "Screen Size"]
      });

      let count = 1;

      Object.keys(families).sort().forEach((family) => {
        table.push([clc.red(_.capitalize(family))]);
        const currentFamily = families[family];
        const sortedCurrentFamily = _.sortBy(currentFamily, ["id"]);

        _.forEach(sortedCurrentFamily, (details) => {
          table.push([
            clc.blackBright(`${count}.`),
            details.id,
            _.upperCase(details.manufacturer),
            _.upperCase(details.os),
            details.osVersion ? details.osVersion : "N/A",
            details.apiLevel ? details.osVersion : "N/A",
            details.screenSize
          ]);
          count++;
        });
      });

      return table;
    }

    return null;
  },

  _buildDeviceCache(testobjectResponse) {
    deviceCache = {};

    _.forEach(testobjectResponse, (details) => {
      deviceCache[details.id] = details;
    });

  }
};
