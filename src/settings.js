import { argv } from "yargs";

const debug = argv.debug;

const config = {
  accessUser: null,
  accessAPI: null,
  appID: null
};

export default {
  debug,
  TESTOBJECT_API_DELAY: process.env.TESTOBJECT_API_DELAY || 20000,
  config
};
