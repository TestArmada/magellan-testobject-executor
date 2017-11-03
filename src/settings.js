import { argv } from "yargs";
import path from "path";

const debug = argv.debug;
const API_DELAY = 20000;
const tempDir = path.resolve(argv.temp_dir || "./temp");

/*eslint-disable no-magic-numbers*/
const config = {
  accessUser: null,
  accessAPI: null,
  appID: null,
  testobjectOutboundProxy: null,

  useTunnels: false,

  tunnel: {
    username: null,
    accessKey: null,
    restUrl: null,

    // optional
    tunnelIdentifier: null,
    connectVersion: null
  },

  appCapabilitiesConfig: null
};

export default {
  debug,
  tempDir,
  MAX_CONNECT_RETRIES: process.env.SAUCE_CONNECT_NUM_RETRIES || 10,
  TESTOBJECT_API_DELAY: process.env.TESTOBJECT_API_DELAY || API_DELAY,
  BASE_SELENIUM_PORT_OFFSET: 56000,
  config
};
