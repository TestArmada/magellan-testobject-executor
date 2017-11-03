import { argv } from "yargs";
import _ from "lodash";
import logger from "testarmada-logger";
import path from "path";
import settings from "./settings";

const TESTOBJECT_REST_URL = "https://us1.api.testobject.com/sc/rest/v1";
const RAND_MAX = 9999999999999999;
const STRNUM_BASE = 16;

const guid = () => Math.round(Math.random() * RAND_MAX).toString(STRNUM_BASE);

const _loadConfig = (filename) => {
  logger.prefix = "TestObject Executor";
  const filepath = path.resolve(process.cwd() + path.sep + filename);

  try {
    /*eslint-disable global-require*/
    const config = require(filepath);
    logger.log(`Loaded config file ${filename}`);
    logger.debug(`Loading config from ${filename}:`);
    logger.debug(`${JSON.stringify(config)}`);
    return _.cloneDeep(config);
  } catch (err) {
    logger.err(`Cannot load config file from ${filename}`);
    logger.err(err);
    throw new Error(err);
  }
};

export default {
  getConfig: () => {
    logger.prefix = "TestObject Executor";
    logger.debug(`executor config: ${JSON.stringify(settings.config)}`);

    return settings.config;
  },

  /*eslint-disable no-unused-vars,complexity*/
  validateConfig: (opts, argvMock = null, envMock = null) => {
    logger.prefix = "TestObject Executor";

    let runArgv = argv;
    let env = process.env;

    if (argvMock) {
      runArgv = argvMock;
    }

    if (envMock) {
      env = envMock;
    }

    // required
    settings.config.accessAPI = env.TESTOBJECT_API_KEY;
    settings.config.accessUser = env.TESTOBJECT_USERNAME;

    // optional
    if (runArgv.to_api_key && !settings.config.accessAPI) {
      // only accept argument from command line if env variable isn't set
      settings.config.accessAPI = runArgv.to_api_key;
    }

    if (runArgv.to_username && !settings.config.accessUser) {
      // only accept argument from command line if env variable isn't set
      settings.config.accessUser = runArgv.to_username;
    }

    // optional:
    if (runArgv.to_app_capabilities_config) {
      settings.config.appCapabilitiesConfig = _loadConfig(runArgv.to_app_capabilities_config);
    }

    // optional: *Outbound* HTTP Testobject-specific proxy configuration. Note
    // that this is for Selenium outbound control traffic only, not the
    // return path.
    if (env.TESTOBJECT_OUTBOUND_PROXY) {
      settings.config.testobjectOutboundProxy = env.TESTOBJECT_OUTBOUND_PROXY;
    }

    if (runArgv.to_create_tunnel) {
      // if to_create_tunnel is in use
      // required
      settings.config.tunnel.username = settings.config.accessUser;

      settings.config.tunnel.accessKey = env.TESTOBJECT_TUNNEL_API_KEY;
      // optional
      if (runArgv.to_tunnel_api_key && !settings.config.tunnel.accessKey) {
        // only accept argument from command line if env variable isn't set
        settings.config.tunnel.accessKey = runArgv.to_tunnel_api_key;
      }

      settings.config.tunnel.tunnelIdentifier = guid();
      settings.config.tunnel.restUrl = TESTOBJECT_REST_URL;
      settings.config.useTunnels = true;
    } else if (runArgv.to_tunnel_id) {
      // if tunnel id is passed in
      settings.config.tunnel.tunnelIdentifier = runArgv.to_tunnel_id;
      settings.config.tunnel.restUrl = TESTOBJECT_REST_URL;
    }

    settings.config.appID = runArgv.to_app_id;

    const parameterWarnings = {
      accessAPI: {
        required: true,
        envKey: "TESTOBJECT_API_KEY"
      },
      accessUser: {
        required: true,
        envKey: "TESTOBJECT_USERNAME"
      }
    };

    if (runArgv.to_devices
      || runArgv.to_device
      || runArgv.to_platform_name
      || runArgv.to_platform_version
      || runArgv.to_list_devices
      || opts.isEnabled) {
      let valid = true;

      _.forEach(parameterWarnings, (v, k) => {
        if (!settings.config[k]) {
          if (v.required) {
            logger.err(`TestObject requires ${k} to be set. Check if the`
              + ` environment variable $${v.envKey} is defined.`);
            valid = false;
          } else {
            logger.warn(`No ${k} is set. This is set via the`
              + ` environment variable $${v.envKey} . This isn't required, but can cause `
              + "problems with TestObject if not set");
          }
        }
      });

      if (!valid) {
        throw new Error("Missing configuration for TestObject connection.");
      }

      // no coexistence of to_devices and to_device
      if (runArgv.to_devices && runArgv.to_device) {
        throw new Error("--to_devices and --to_device cannot co-exist in the arguments");
      }

      // no coexistence of to_devices and to_device
      if (runArgv.to_devices &&
        (runArgv.to_platform_name || runArgv.to_platform_version)) {
        throw new Error("--to_devices and --to_platform_name or --to_platform_name "
          + "cannot co-exist in the arguments");
      }

      // validate tunnel configs
      if (runArgv.to_create_tunnel) {
        if (!settings.config.tunnel.accessKey) {
          logger.err(`TestObject requires TESTOBJECT_TUNNEL_API_KEY to be set. Check if the`
            + ` environment variable TESTOBJECT_TUNNEL_API_KEY is defined.`);

          throw new Error("Missing configuration for TestObject connection.");
        }

        if (runArgv.to_tunnel_id) {
          logger.warn("--to_create_tunnel and --to_tunnel_id shouldn't be used together." +
            " TestObject excutor will ignore --to_tunnel_id in this case.");
        }
      }

      logger.debug("TestObject configuration: ");
      logger.debug(JSON.stringify(settings.config));

      logger.log("TestObject configuration OK");
    }

    return settings.config;
  }
};
