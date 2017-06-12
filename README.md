# magellan-testobject-executor

[![Build Status](https://travis-ci.org/TestArmada/magellan-testobject-executor.svg?branch=master)](https://travis-ci.org/TestArmada/magellan-testobject-executor)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/TestArmada/magellan-testobject-executor/branch/master/graph/badge.svg)](https://codecov.io/gh/TestArmada/magellan-testobject-executor)

Executor for [Magellan](https://github.com/TestArmada/magellan) to run [nightwatchjs](http://nightwatchjs.org/) tests in [TestObject](https://testobject.com/) environment.

**PLEASE NOTE: Executor is only supported by magellan version 10.0.0 or higher**.

## What does this executor do
 1. It talks [Muffin]() so that the desiredCapabilities shrinks down to a string, which makes your browser selection an easy work
 2. It runs nightwatch test by forking it as magellan child process

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
 ```
 export TESTOBJECT_USERNAME=${USERNAME}
 export TESTOBJECT_ACCESS_API=${ACCESS_KEY}
 ```

 4. `./node_modules/.bin/magellan --help` to see if you can see the following content printed out
 ```
  Executor-specific (testarmada-magellan-testobject-executor)
   --to_device=devicename               String represents one device which TestObject supports
   --to_devices=d1,d2,..                String represents multiple devices which TestObject supports
   --to_list_devices                    List the available devices TestObject supports.
   --to_app_id=1                        APP id of the uploaded app to TestObject
 ```

Congratulations, you're all set. 

# NOTICE

There is an issue in TestObject test result report API. If test result is reported right after the `driver.end()` has been called, there is a chance that your result won't be saved. Therefore we have added a delay before result report API is invoked. By default the delay is 20 seconds but you can change it by setting this environment variable `TESTOBJECT_API_DELAY` in milliseconds.
