# magellan-testobject-executor

[![Build Status](https://travis-ci.org/TestArmada/magellan-testobject-executor.svg?branch=master)](https://travis-ci.org/TestArmada/magellan-testobject-executor)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/TestArmada/magellan-testobject-executor/branch/master/graph/badge.svg)](https://codecov.io/gh/TestArmada/magellan-testobject-executor)
[![Downloads](http://img.shields.io/npm/dm/testarmada-magellan-testobject-executor?style=flat)](https://npmjs.org/package/testarmada-magellan-testobject-executor)

Executor for [Magellan](https://github.com/TestArmada/magellan) to run [nightwatchjs](http://nightwatchjs.org/) tests in [TestObject](https://testobject.com/) environment.

**PLEASE NOTE: Executor is only supported by magellan version 10.0.0 or higher**.

## What does this executor do
 1. It talks [Muffin]() so that the desiredCapabilities shrinks down to a string, which makes your browser selection an easy work
 2. It runs nightwatch test by forking it as magellan child process
 3. It launches sauce tunnel and manages its life cycle for you during test. Check this [page](https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy+and+Real+Device+Testing) for more details.

## How To Use
Please follow the steps

 1. `npm install testarmada-magellan-testobject-executor --save`
 2. add following block to your `magellan.json` (if there isn't a `magellan.json` please create one under your folder root)
 ```javascript
 "executors": [
    "testarmada-magellan-testobject-executor"
 ]
 ```
 3. set env variables
 ```bash
 export TESTOBJECT_USERNAME=${USERNAME}
 export TESTOBJECT_API_KEY=${ACCESS_KEY}
 ```

If you want to use this executor to launch sauce tunnel for you, set this env variable.
```bash
export TESTOBJECT_TUNNEL_API_KEY=${SAUCE_CONNECT_ACCESS_KEY}
``` 

Optional env variable. If set, all traffic to TestObject, including TestObject api and selenium calls, will be going through it.
```bash
export TESTOBJECT_OUTBOUND_PROXY=http://${your.proxy}:${your.port}
```

 4. `./node_modules/.bin/magellan --help` to see if you can see the following content printed out
 ```
  Executor-specific (testarmada-magellan-testobject-executor)
   --to_device=devicename               String represents one device which TestObject supports
   --to_devices=d1,d2,..                String represents multiple devices which TestObject supports
   --to_list_devices                    List the available devices TestObject supports.
   --to_create_tunnel                   Create and use sauce tunnel for testing
   --to_tunnel_id                       Existing tunnel identifier for testing
   --to_app_id=1                        APP id of the uploaded app to TestObject
   --to_platform_name=iOS               String represents the mobile platform
   --to_platform_version=10.2           String represents the mobile platform version
 ```

Congratulations, you're all set. 

## Run your test with sauce tunnel
TestObject recently launched the beta program to run real device test with sauce tunnel. Find more info [here](https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy+and+Real+Device+Testing). You can tell this executor if you want it to manage sauce tunnel for you during test, or if you want to use an existing sauce tunnel.

1. launch sauce tunnel automatically

Simply set `TESTOBJECT_TUNNEL_API_KEY` env variable and add `--to_create_tunnel` to your command line. This executor will create a tunnel for you per magellan run, and automatically close it eventually.

2. use an existing sauce tunnel

Add `--to_tunnel_id ${TUNNEL_ID}` to your command line. This executor will add `${TUNNEL_ID}` to desiredCapabilities.

Please note: `--to_create_tunnel` and `--to_tunnel_id` cannot co-exist. Once executor founds them both from command line, `--to_create_tunnel` will be in use. 


## Run your test in parallel
TestObject takes both generic device desiredCapability with device and platform information and specific device id. A specific device id is a string that TestObject uses as an unique identifier to represent a particular device. There are two ways to get device id

1. via TestObject's website
2. via executor's `--to_list_devices`

However explicitly telling executor to run tests in a specific device isn't a good idea for your parallel tests. What TestObject recommends is to use generic device desiredCapability to declare what platform and device you prefer tests to run, and TestObject will run them in parallel as best as it can depending on your device's availability. To set generic device desiredCapabilities, follow these steps so that this executor can compose the proper desiredCapabilities.

1. use `--to_platform_name`, `--to_platform_version` and/or `--to_device`.
2. set device name info like `"Samsung Galaxy S7"` to `--to_device`, instead of specific device id `"Samsung_Galaxy_S7_wm1"`.

Example to set generic device desiredCapabilities

```bash
--to_platform_name Android --to_platform_version 7 --to_device "Samsung Galaxy S8"
```

or

```js
// in your magellan.json
{
    "browser": "Samsung Galaxy S8",
    "executor": "testobject",
    "appium": {
        "appiumVersion": "1.6.5",
        "platformName": "Android",
        "platformVersion": "7"
    }
}

```


# NOTICE

There is an issue in TestObject test result report API. If test result is reported right after the `driver.end()` has been called, there is a chance that your result won't be saved. Therefore we have added a delay before result report API is invoked. By default the delay is 20 seconds but you can change it by setting this environment variable `TESTOBJECT_API_DELAY` in milliseconds.


Documentation in this project is licensed under Creative Commons Attribution 4.0 International License. Full details available at https://creativecommons.org/licenses/by/4.0
