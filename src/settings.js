import { argv } from "yargs";

const debug = argv.debug;

const config = {
  accessAPI: null,
  appID: null
};

export default {
  debug,
  config
};
