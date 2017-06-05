import { argv } from "yargs";

const debug = argv.debug;

const config = {
  accessUser: null,
  accessAPI: null,
  appID: null
};

export default {
  debug,
  config
};
