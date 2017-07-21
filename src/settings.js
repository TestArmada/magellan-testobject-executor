import { argv } from "yargs";

const debug = argv.debug;
const API_DELAY = 20000;

const config = {
  accessUser: null,
  accessAPI: null,
  appID: null,
  testobjectOutboundProxy: null
};

export default {
  debug,
  TESTOBJECT_API_DELAY: process.env.TESTOBJECT_API_DELAY || API_DELAY,
  config
};
